import {
  afterNextRender,
  Component,
  ElementRef,
  forwardRef,
  input,
  OnDestroy,
  output,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { IJodit } from 'jodit/esm/types';

export type ImageUploadFn = (file: File) => Promise<string>;

/**
 * WYSIWYG HTML editor (Jodit) usable with ngModel / reactive forms.
 * Takes and emits an HTML string. Images (toolbar button, paste, drag&drop)
 * are uploaded through the `uploadImage` callback, which must resolve to the image URL.
 * Deleting an image with the image popup's Delete button emits `imageDeleted` with its src.
 * Jodit touches `window`, so it is loaded lazily in the browser only (SSR safe).
 */
@Component({
  selector: 'app-html-editor',
  standalone: true,
  template: `<textarea #host></textarea>`,
  styleUrl: './html-editor.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HtmlEditorComponent),
      multi: true,
    },
  ],
})
export class HtmlEditorComponent implements ControlValueAccessor, OnDestroy {
  uploadImage = input<ImageUploadFn>();
  placeholder = input('Start writing...');
  height = input('70vh');
  imageDeleted = output<string>();

  private host = viewChild.required<ElementRef<HTMLTextAreaElement>>('host');
  private editor?: IJodit;
  private value = '';
  private disabled = false;
  private destroyed = false;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    afterNextRender(() => this.initEditor());
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
    if (this.editor && this.editor.value !== this.value) {
      this.editor.value = this.value;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.editor?.setReadOnly(isDisabled);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.editor?.destruct();
  }

  private async initEditor() {
    // CSS is copied to /jodit/ as an asset (angular.json) so it stays out of every bundle
    const [{ Jodit }] = await Promise.all([
      import('jodit'),
      loadStylesheet('jodit/jodit.min.css'),
    ]);
    // The ESM entry ships only core plugins; source, video, fullsize, preview, etc. live here
    await import('jodit/esm/plugins/all.js');
    if (this.destroyed) return;

    // Jodit's DeepPartial<Config> is too deep for the TS checker, hence the cast
    this.editor = Jodit.make(
      this.host().nativeElement,
      this.buildConfig(Jodit.defaultOptions.popup['img']) as any
    );
    this.editor.value = this.value;
    this.editor.setReadOnly(this.disabled);

    this.editor.events
      .on('change', (newValue: string) => {
        if (newValue === this.value) return;
        this.value = newValue;
        this.onChange(newValue);
      })
      .on('blur', () => this.onTouched());
  }

  private buildConfig(defaultImgPopup: unknown) {
    return {
      height: this.height(),
      placeholder: this.placeholder(),
      language: 'en',
      toolbarAdaptive: false,
      toolbarSticky: true,
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      // Ace and js-beautify load from a CDN, which the site's CSP blocks
      sourceEditor: 'area',
      beautifyHTML: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: 'insert_clear_html',
      // Let the article styles size images instead of a fixed inline width
      imageDefaultWidth: null as unknown as number,
      buttons: [
        'undo', 'redo', '|',
        'paragraph', 'bold', 'italic', 'underline', 'strikethrough', 'eraser', '|',
        'ul', 'ol', 'indent', 'outdent', 'align', '|',
        'brush', 'classSpan', '|',
        'link', 'image', 'video', 'table', 'hr', 'symbols', '|',
        'source', 'fullsize', 'preview',
      ],
      popup: {
        img: (Array.isArray(defaultImgPopup) ? defaultImgPopup : []).map((item) =>
          item?.name === 'delete'
            ? {
                ...item,
                exec: (editor: IJodit, image: HTMLImageElement | null) => {
                  if (!image) return;
                  const src = image.getAttribute('src') ?? '';
                  editor.s.removeNode(image);
                  if (src) this.imageDeleted.emit(src);
                },
              }
            : item
        ),
      },
      controls: {
        classSpan: {
          list: { 'col-2': 'Two columns' },
          tooltip: 'CSS class',
        },
      },
      uploader: {
        // Required by some Jodit UI checks; actual sending is done in customUploadFunction
        url: '/api/upload-image',
        insertImageAsBase64URI: false,
        imagesExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'],
        processFileName: (key: string, file: File, name: string) => [
          key,
          file,
          uniqueFileName(name),
        ],
        customUploadFunction: (data: FormData) => this.uploadFiles(data),
      },
    };
  }

  private async uploadFiles(data: FormData) {
    const upload = this.uploadImage();
    const files: File[] = [];
    data.forEach((entry) => {
      if (entry instanceof File) files.push(entry);
    });

    try {
      if (!upload) throw new Error('Image upload is not configured');
      const urls: string[] = [];
      // Sequential: keeps the insert order and spares the server
      for (const file of files) {
        urls.push(await upload(file));
      }
      return {
        success: true,
        time: new Date().toISOString(),
        data: {
          files: urls,
          isImages: urls.map(() => true),
          baseurl: '',
          messages: [],
        },
      };
    } catch (error) {
      console.error('Editor image upload error', error);
      return {
        success: false,
        time: new Date().toISOString(),
        data: {
          files: [],
          baseurl: '',
          messages: ['Image upload failed'],
        },
      };
    }
  }
}

/** Adds a <link> once; resolved against <base href> so it works for every locale. */
function loadStylesheet(path: string) {
  const href = new URL(path, document.baseURI).href;
  const existing = document.querySelector<HTMLLinkElement>(
    `link[href="${href}"]`
  );
  if (existing) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    // Don't block the editor if the CSS fails; it just renders unstyled
    link.onload = link.onerror = () => resolve();
    document.head.appendChild(link);
  });
}

/** Makes a URL-safe, collision-free file name (pasted images are all "image.png"). */
function uniqueFileName(name: string) {
  const dot = name.lastIndexOf('.');
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : 'png';
  const safeBase =
    base
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'image';
  const suffix = `${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;
  return `${safeBase}-${suffix}.${ext}`;
}

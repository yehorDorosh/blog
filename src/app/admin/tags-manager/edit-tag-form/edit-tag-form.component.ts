import { Component, signal, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagService } from '../tag.service';
import { TranslatableContent, Tag } from '../../../blog/blog.model';
import { LangSwitcherService } from '../../../lang-switcher/lang-switcher.service';

@Component({
  selector: 'app-edit-tag-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-tag-form.component.html',
  styleUrl: './edit-tag-form.component.scss',
})
export class EditTagFormComponent {
  private tagService = inject(TagService);
  private langSwitcherService = inject(LangSwitcherService);

  tag = input.required<Tag>();
  onEditTag = output();

  langList = signal(this.langSwitcherService.langList);
  tagTranslations: TranslatableContent = this.langList().reduce((acc, lang) => {
    acc[lang] = '';
    return acc;
  }, {} as TranslatableContent);

  ngOnInit() {
    this.tagTranslations = this.langList().reduce((acc, lang) => {
      acc[lang] = this.tag().label[lang];
      return acc;
    }, {} as TranslatableContent);
  }

  editTag() {
    if (Object.values(this.tagTranslations).every((value) => value === '')) {
      return;
    }

    const tag: Tag = {
      ...this.tag(),
    };

    this.langList().forEach((lang) => {
      if (this.tagTranslations[lang] !== this.tag().label[lang])
        tag.label[lang] = this.tagTranslations[lang];
    });

    this.tagService.editTag(tag);
    this.onEditTag.emit();
  }
}

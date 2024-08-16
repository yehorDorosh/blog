import { Component, inject, signal } from '@angular/core';
import { TagService } from '../tag.service';
import { TranslatableContent } from '../../../blog/blog.model';
import { LangSwitcherService } from '../../../lang-switcher/lang-switcher.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-tag-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-tag-form.component.html',
  styleUrl: './add-tag-form.component.scss',
})
export class AddTagFormComponent {
  private tagService = inject(TagService);
  private langSwitcherService = inject(LangSwitcherService);

  langList = signal(this.langSwitcherService.langList);
  tagTranslations: TranslatableContent = this.langList().reduce((acc, lang) => {
    acc[lang] = '';
    return acc;
  }, {} as TranslatableContent);

  addTag() {
    if (Object.values(this.tagTranslations).every((value) => value === '')) {
      return;
    }
    this.tagService.addTag(this.tagTranslations);

    this.tagTranslations = this.langList().reduce((acc, lang) => {
      acc[lang] = '';
      return acc;
    }, {} as TranslatableContent);
  }
}

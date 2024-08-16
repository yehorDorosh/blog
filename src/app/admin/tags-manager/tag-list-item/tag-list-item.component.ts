import { Component, input, inject, signal } from '@angular/core';
import { Tag } from '../../../blog/blog.model';
import { LangList } from '../../../lang-switcher/lang-switcher.model';
import { TagService } from '../tag.service';
import { EditTagFormComponent } from '../edit-tag-form/edit-tag-form.component';

@Component({
  selector: 'app-tag-list-item',
  standalone: true,
  imports: [EditTagFormComponent],
  templateUrl: './tag-list-item.component.html',
  styleUrl: './tag-list-item.component.scss',
})
export class TagListItemComponent {
  tag = input.required<Tag>();
  langList = input.required<LangList[]>();

  tagService = inject(TagService);

  isEditorOpened = signal(false);

  onDeleteTag() {
    this.tagService.deleteTag(this.tag().id);
  }

  onOpenEditor() {
    this.isEditorOpened.update((val) => !val);
  }
}

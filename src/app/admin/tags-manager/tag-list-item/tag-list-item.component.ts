import {
  Component,
  input,
  inject,
  signal,
  output,
  computed,
} from '@angular/core';
import { Tag } from '../../../blog/blog.model';
import { LangList } from '../../../lang-switcher/lang-switcher.model';
import { TagService } from '../tag.service';
import { EditTagFormComponent } from '../edit-tag-form/edit-tag-form.component';
import { UserService } from '../../../user/user.service';

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
  isAdminMode = input<boolean>(false);
  lang = input.required<LangList>();
  onSelected = output<string>();

  tagService = inject(TagService);
  user = inject(UserService);

  isEditorOpened = signal(false);
  tagActive = signal(false);

  isEditable = computed(() => {
    const localID = this.user.user()?.localId;
    const tagUserId = this.tag().userId;
    return localID === tagUserId;
  });

  onDeleteTag() {
    this.tagService.deleteTag(this.tag().id);
  }

  onOpenEditor() {
    this.isEditorOpened.update((val) => !val);
  }

  onTagClick(id: string) {
    this.onSelected.emit(id);
    this.tagActive.update((val) => !val);
  }
}

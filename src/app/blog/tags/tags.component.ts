import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  output,
} from '@angular/core';
import { TagService } from '../../admin/tags-manager/tag.service';
import { LangSwitcherService } from '../../lang-switcher/lang-switcher.service';
import { TagListItemComponent } from '../../admin/tags-manager/tag-list-item/tag-list-item.component';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [TagListItemComponent],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss',
})
export class TagsComponent implements OnInit {
  private tagService = inject(TagService);
  langSwitcherService = inject(LangSwitcherService);
  onSelected = output<string>();

  tags = computed(() => this.tagService.tagsList());
  langList = signal(this.langSwitcherService.langList);

  ngOnInit() {
    this.tagService.getTags();
  }

  onTagSelected(id: string) {
    this.onSelected.emit(id);
  }
}

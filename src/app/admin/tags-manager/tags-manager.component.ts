import { Component, inject, signal, computed } from '@angular/core';
import { TagService } from './tag.service';
import { LangSwitcherService } from '../../lang-switcher/lang-switcher.service';
import { AddTagFormComponent } from './add-tag-form/add-tag-form.component';
import { TagListItemComponent } from './tag-list-item/tag-list-item.component';

@Component({
  selector: 'app-tags-manager',
  standalone: true,
  imports: [AddTagFormComponent, TagListItemComponent],
  templateUrl: './tags-manager.component.html',
  styleUrl: './tags-manager.component.scss',
})
export class TagsManagerComponent {
  private tagService = inject(TagService);
  private langSwitcherService = inject(LangSwitcherService);

  tags = computed(() => this.tagService.tagsList());
  langList = signal(this.langSwitcherService.langList);

  ngOnInit() {
    this.tagService.getTags();
  }
}

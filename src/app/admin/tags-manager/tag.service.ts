import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import {
  Tags,
  Tag,
  FireBaseResponse,
  GetTagsResponse,
  TranslatableContent,
} from '../../blog/blog.model';
import { environment } from '../../../environments/environment';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  httpClient = inject(HttpClient);
  userService = inject(UserService);

  tagsList = signal<Tags>([]);

  getTags(cb?: () => void) {
    const subscription = this.httpClient
      .get<GetTagsResponse>(
        `${
          environment.fireBase.apiUrl
        }/tags.json?&cache=${new Date().getTime()}`
      )
      .subscribe({
        next: (response) => {
          if (!response) {
            this.tagsList.set([]);
            return;
          }

          const tags: Tag[] = Object.keys(response).flatMap((localId) =>
            Object.keys(response[localId]).map((tagId) => ({
              id: tagId,
              userId: localId,
              label: response[localId][tagId].label,
            }))
          );
          this.tagsList.set(tags);
          if (cb) cb();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  addTag(tag: TranslatableContent) {
    const subscription = this.httpClient
      .post<FireBaseResponse>(
        `${environment.fireBase.apiUrl}/tags/${
          this.userService.user()?.localId
        }.json?auth=${this.userService.getToken}`,
        { label: tag }
      )
      .subscribe({
        next: (response) => {
          if (!environment.production) console.log('Tag added', response);
          this.getTags();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  editTag(tag: Tag) {
    const subscription = this.httpClient
      .patch(
        `${environment.fireBase.apiUrl}/tags/${tag.userId}/${tag.id}.json?auth=${this.userService.getToken}`,
        { label: tag.label }
      )
      .subscribe({
        next: (response) => {
          if (!environment.production) console.log('Tag edited', response);
          this.getTags();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  deleteTag(tagId: string) {
    const userId = this.tagsList().find((tag) => tag.id === tagId)?.userId;

    if (!userId) return;

    const subscription = this.httpClient
      .delete(
        `${environment.fireBase.apiUrl}/tags/${userId}/${tagId}.json?auth=${this.userService.getToken}`
      )
      .subscribe({
        next: (response) => {
          if (!environment.production) console.log('Tag deleted', response);
          this.getTags();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}

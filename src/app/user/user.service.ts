import {
  Injectable,
  afterNextRender,
  inject,
  computed,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { type User, type RefreshTokenResponse } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private router = inject(Router);
  private httpClient = inject(HttpClient);

  private logoutDate: Date | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private loading = false;

  user = signal<User | null>(null);
  timeToLogout = signal<number>(60);

  constructor() {
    afterNextRender(() => {
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString) as User;
        if (user && user.logOutDate) {
          this.user.set({ ...user, logOutDate: new Date(user.logOutDate) });
          this.logoutDate = new Date(user.logOutDate);
          this.startTokenCheckInterval();
        }
      }
    });
  }

  isLoggedIn = computed(() => {
    return !!this.user();
  });

  setUser(user: User) {
    this.user.set(user);
    this.setLogoutDate(user);
    user.logOutDate = this.logoutDate;
    localStorage.setItem('user', JSON.stringify(user));
    this.startTokenCheckInterval();
  }

  get getToken() {
    const user = this.user();
    if (user) {
      return user.idToken;
    } else {
      return '';
    }
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem('user');
    this.clearInterval();
    this.router.navigate(['/']);
  }

  private startTokenCheckInterval() {
    this.clearInterval();
    this.intervalId = setInterval(() => {
      // console.log((+this.logoutDate! - +new Date())/1000/60);
      this.timeToLogout.set((+this.logoutDate! - +new Date()) / 1000 / 60);

      if (this.logoutDate && new Date() >= this.logoutDate) {
        if (!environment.production)
          console.log('Token expired. Logging out...');
        this.logout();
      } else if (this.timeToLogout() && this.timeToLogout() < 5) {
        if (!this.loading) {
          if (!environment.production) console.log('Refreshing token...');
          this.refreshToken();
        }
      }
    }, 1000);
  }

  private clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private setLogoutDate(user: User) {
    this.logoutDate = new Date(new Date().getTime() + +user.expiresIn * 1000);
  }

  refreshToken() {
    this.loading = true;
    this.httpClient
      .post<RefreshTokenResponse>(
        `${environment.fireBase.authApiUrlRefresh}?key=${environment.fireBase.apiKey}`,
        {
          grant_type: 'refresh_token',
          refresh_token: this.user()!.refreshToken,
        }
      )
      .subscribe({
        next: (response) => {
          if (!environment.production) console.log(response);

          this.setUser({
            email: this.user()!.email,
            idToken: response.id_token,
            expiresIn: response.expires_in,
            localId: response.user_id,
            logOutDate: null,
            refreshToken: response.refresh_token,
          });
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}

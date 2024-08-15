import {
  Injectable,
  afterNextRender,
  inject,
  computed,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { type User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private router = inject(Router);

  private logoutDate: Date | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  user = signal<User | null>(null);

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
      if (this.logoutDate && new Date() >= this.logoutDate) {
        console.log('Token expired. Logging out...');
        this.logout();
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
}

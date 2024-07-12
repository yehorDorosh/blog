import { Injectable, afterNextRender, computed, signal } from '@angular/core';

import { type User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User | null = null;
  logoutDate: Date | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    afterNextRender(() => {
      const user = localStorage.getItem('user');
      if (user) {
        this.user = JSON.parse(user);
        this.setLogoutDate(this.user!);
        this.startTokenCheckInterval();
      }
    });
  }

  setUser(user: User) {
    user.expiresIn = '10'
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
   this.setLogoutDate(user); 
    this.startTokenCheckInterval();
  }

  getToken = computed(() => {
    const user = this.user;
    if (user) {
      return user.idToken;
    } else {
      return '';
    }
  })

  logout() {
    this.user = null;
    localStorage.removeItem('user');
    this.clearInterval();
  }

  private startTokenCheckInterval() {
    this.clearInterval();
    this.intervalId = setInterval(() => {
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

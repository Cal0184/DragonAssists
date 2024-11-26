import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private storageService: StorageService) {}

  async canActivate(): Promise<boolean> {
    const userToken = await this.storageService.getItem('userToken');

    if (!userToken) {
      this.router.navigate(['/home']);
      return false;
    }

    return true;
  }
}

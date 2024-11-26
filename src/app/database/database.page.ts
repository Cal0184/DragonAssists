import { Component, OnInit } from '@angular/core';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-database',
  templateUrl: './database.page.html',
  styleUrls: ['./database.page.scss'],
})
export class DatabasePage implements OnInit {
  allUsers: { username: string; password: string }[] = [];

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    this.allUsers = await this.storageService.getAllUsers();
    console.log('Usuarios almacenados:', this.allUsers);
  }

  goToLogin() {
    this.router.navigate(['/home']);
  }
}



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  nombre: string = '';
  password: string = '';
  isInputValid: boolean = true;
  isPasswordValid: boolean = true;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    const users = await this.storageService.getAllUsers();
  
    const userExists = users.some(user => user.username === 'cris.lara@duocuc.cl');
    if (!userExists) {
      await this.storageService.addUserWithPassword('cris.lara@duocuc.cl', 'L210827315');
      console.log('Usuario registrado: cris.lara@duocuc.cl');
    } else {
      console.log('El usuario ya está registrado.');
    }
    
    const userToken = await this.storageService.getItem('userToken');
    if (userToken) {
      const isValidUser = await this.storageService.validateUser(userToken, ''); 
      if (isValidUser) {
        this.router.navigate(['/login'], { queryParams: { nombre: userToken } });
      } else {
        console.log('Token inválido o usuario no encontrado.');
        await this.storageService.removeItem('userToken'); // Limpia tokens inválidos
      }
    }
  }

  async login() {
    // Validar nombre y contraseña
    if (!this.nombre || this.nombre.trim() === '') {
      await this.showAlert('Por favor, ingresa tu nombre de usuario para continuar.');
      return;
    }
    if (!this.password || this.password.trim() === '') {
      await this.showAlert('Por favor, ingresa tu contraseña para continuar.');
      return;
    }

    const isValid = await this.storageService.validateUser(this.nombre, this.password);
    if (isValid) {
      // Credenciales válidas: guardar el token y redirigir
      await this.storageService.setItem('userToken', this.nombre);
      this.router.navigate(['/login'], { queryParams: { nombre: this.nombre } });
    } else {
      // Credenciales inválidas: mostrar alerta
      await this.showAlert('Nombre de usuario o contraseña incorrectos.');
    }
  }

  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}

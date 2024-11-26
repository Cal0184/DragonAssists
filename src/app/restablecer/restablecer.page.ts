import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restablecer',
  templateUrl: './restablecer.page.html',
  styleUrls: ['./restablecer.page.scss'],
})
export class RestablecerPage {
  constructor(private alertController: AlertController, private router: Router) {}

  async restablecer() {
    const alert = await this.alertController.create({
      header: 'Correo enviado',
      message: 'Hemos enviado un enlace para restablecer tu contraseña. Por favor revisa tu correo.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}

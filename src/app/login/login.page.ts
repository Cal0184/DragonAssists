import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  nombre: string = '';
  porcentajeAsistencia: number = 75;
  scannedCode: string | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.nombre = params['nombre'] || '';
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  async goDatabase() {
    const nombreUsuario = 'usuario_de_prueba';
    await this.storageService.setItem('nombreUsuario', nombreUsuario);
    this.router.navigate(['/home']);
  }

  login() {
    console.log('Iniciar sesión con el nombre:', this.nombre);
  }

  ingresarAsistencia() {
    this.porcentajeAsistencia = Math.min(this.porcentajeAsistencia + 10, 100);
    console.log('Asistencia ingresada. Nuevo porcentaje:', this.porcentajeAsistencia);
  }

  async startScan() {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (!status.granted) {
        throw new Error('No se otorgaron permisos para usar la cámara.');
      }

      document.body.style.background = 'transparent';
      await BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        this.scannedCode = result.content;
        console.log('Código escaneado:', this.scannedCode);
      } else {
        console.log('No se detectó ningún código.');
      }
    } catch (error: any) {
      console.error('Error durante el escaneo:', error.message);
      this.showAlert('Error', error.message);
    } finally {
      await BarcodeScanner.stopScan();
    }
  }

  async stopScan() {
    await BarcodeScanner.stopScan();
    document.body.style.background = '';
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}

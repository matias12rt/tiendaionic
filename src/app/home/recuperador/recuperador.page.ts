import { Component } from '@angular/core';
import { ApiService } from '../../servicios_db_api/api.service'; // Tu servicio para manejar JSON Server
import emailjs from '@emailjs/browser';
import { ToastController, AnimationController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperador',
  templateUrl: './recuperador.page.html',
  styleUrls: ['./recuperador.page.scss'],
})
export class RecuperadorPage {
  correo: string = '';
  codigoEnviado: boolean = false;
  codigoVerificado: boolean = false;
  codigoGenerado: string = '';
  codigoIngresado: string = '';
  nuevaContrasena: string = '';

  constructor(
    private apiService: ApiService,
    private toastController: ToastController,
    private animationCtrl: AnimationController,
    private router: Router
  ) {}

  // Función para verificar correo
  verificarCorreo() {
    this.apiService.verificarCorreo(this.correo).subscribe((existe) => {
      if (existe) {
        this.codigoGenerado = Math.floor(100000 + Math.random() * 900000).toString(); // Código aleatorio
        this.enviarCodigoCorreo();
      } else {
        this.mostrarToast('El correo no está registrado.');
      }
    });
  }

  // Enviar código al correo
  enviarCodigoCorreo() {
    const templateParams = {
      to_email: this.correo,
      code: this.codigoGenerado,
    };

    emailjs
      .send('service_95qkpr9', 'template_mawzxra', templateParams, 'FYujKSdZgk_p2CTHF')
      .then(() => {
        this.codigoEnviado = true;
        this.mostrarToast('Código enviado al correo.');
      })
      .catch((error) => {
        console.error('Error al enviar el correo:', error);
        this.mostrarToast('Error al enviar el código.');
      });
  }

  // Verificar código ingresado
  verificarCodigo() {
    if (this.codigoIngresado === this.codigoGenerado) {
      this.codigoVerificado = true;
      this.mostrarToast('Código verificado correctamente.');
    } else {
      this.mostrarToast('El código ingresado es incorrecto.');
    }
  }

  // Cambiar contraseña
  cambiarContrasena() {
    this.apiService
      .cambiarContrasena(this.correo, this.nuevaContrasena)
      .subscribe(() => {
        this.mostrarToast('Contraseña cambiada exitosamente.');
        // Redirigir al login o limpiar los datos
      });
  }

  // Mostrar mensajes de toast con animación
  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top',
      animated: true,
      color: 'primary',
    });

    // Agregar animación de entrada
    const animacion = this.animationCtrl.create()
      .addElement(toast)
      .duration(500)
      .fromTo('transform', 'scale(0)', 'scale(1)'); // Escala para el efecto de aparición
    animacion.play();

    await toast.present();
  }

  // Redirigir al login
  volverAlLogin() {
    this.router.navigate(['/login']);
  }
}

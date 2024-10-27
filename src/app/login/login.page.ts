import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ApiService } from '../servicios_db_api/api.service';
import { AuthenticationService } from '../gurads/authentication.service'; // Asegúrate de usar la ruta correcta

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild(IonModal, { static: false }) modal!: IonModal;

  identifier: string = ''; // Campo único para RUT o correo
  password: string = '';
  identifierError: string = '';
  passwordError: string = '';
  message: string = '';

  constructor(private router: Router, private apiService: ApiService, private authenticationService: AuthenticationService) {}

  ngOnInit(): void {}

  // Maneja el inicio de sesión
  login() {
    this.identifierError = '';
    this.passwordError = '';

    // Verificar si los campos están vacíos
    if (this.identifier.trim() === '' || this.password.trim() === '') {
      this.identifierError = 'Correo o RUT y contraseña son obligatorios';
      return;
    }

    // Validar si el campo es un correo electrónico
    if (this.isValidEmail(this.identifier)) {
      // Llamar al API para verificar tanto el correo como la contraseña
      this.apiService.verificarUsuario(this.identifier, this.password).subscribe(userExists => {
        if (userExists) {
          // Iniciar sesión si ambos (correo y contraseña) son correctos
          this.authenticationService.login(); // Inicia sesión
          const navigationExtras: NavigationExtras = {
            state: {
              email: this.identifier // Enviar el correo al navegar a 'tienda'
            }
          };
          this.router.navigate(['/tienda'], navigationExtras);
        } else {
          this.passwordError = 'Correo o contraseña incorrectos';
        }
      }, error => {
        this.identifierError = 'Error al verificar el usuario.'; // Manejo de error
      });
    } else {
      // Asumir que es un RUT y verificar con la API
      this.apiService.verificarAdmin(this.identifier, this.password).subscribe(adminExists => {
        if (adminExists) {
          // Iniciar sesión si ambos (RUT y contraseña) son correctos
          this.authenticationService.login(); // Inicia sesión
          const navigationExtras: NavigationExtras = {
            state: {
              rut: this.identifier // Enviar el RUT al navegar a 'administracion'
            }
          };
          this.router.navigate(['/administracion'], navigationExtras);
        } else {
          this.passwordError = 'RUT o contraseña incorrectos';
        }
      }, error => {
        this.identifierError = 'Error al verificar el RUT.'; // Manejo de error
      });
    }
  }

  // Función para validar el correo electrónico
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Función para manejar el cierre del modal
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  // Función para confirmar la recuperación de contraseña
  confirm() {
    if (this.isValidEmail(this.identifier)) {
      this.modal.dismiss(this.identifier, 'confirm');
    }
  }

  // Maneja el evento de cierre del modal
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `A reset link has been sent to ${ev.detail.data}!`;
    }
  }

  // Navega a la página de registro
  goToRegistro() {
    this.router.navigate(['/registro-cli']);
  }
}

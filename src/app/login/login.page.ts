import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ApiService } from '../servicios_db_api/api.service';
import { AuthenticationService } from '../gurads/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild(IonModal, { static: false }) modal!: IonModal;

  identifier: string = '';
  password: string = '';
  identifierError: string = '';
  passwordError: string = '';
  message: string = '';
  
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  recuperarContrasenaError: string = '';
  recuperarContrasenaSuccess: string = '';
  
  isRecoverModalOpen = false; 
  isChangePasswordModalOpen = false; 

  constructor(private router: Router, private apiService: ApiService, private authenticationService: AuthenticationService) {}

  
  ngOnInit(): void {}

  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    const data = event.detail.data; // Si necesitas manejar datos específicos del modal
    console.log('Modal dismissed', data);
  }

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

   // Función para abrir el modal de recuperación
   openRecoverModal() {
    this.isRecoverModalOpen = true;
  }

  // Función para cerrar el modal de recuperación
  closeRecoverModal() {
    this.isRecoverModalOpen = false;
    this.recuperarContrasenaError = '';
    this.recuperarContrasenaSuccess = '';
    this.identifier = ''; // Reiniciar el campo de identificación
  }

  // Función para confirmar la recuperación de contraseña
  confirm() {
    this.recuperarContrasenaError = '';
    this.recuperarContrasenaSuccess = '';

    if (this.isValidEmail(this.identifier)) {
      this.apiService.verificarCorreo(this.identifier).subscribe(existe => {
        if (existe) {
          this.closeRecoverModal(); // Cerrar el modal de recuperación
          this.showChangePasswordModal(); // Abrir el modal de cambio de contraseña
        } else {
          this.recuperarContrasenaError = 'El correo no está registrado.';
        }
      });
    } else {
      this.apiService.verificarCorreoadmin(this.identifier).subscribe(existe => {
        if (existe) {
          this.closeRecoverModal(); // Cerrar el modal de recuperación
          this.showChangePasswordModal(); // Abrir el modal de cambio de contraseña
        } else {
          this.recuperarContrasenaError = 'El RUT no está registrado.';
        }
      });
    }
  }

  // Método para abrir el modal de cambiar contraseña
  showChangePasswordModal() {
    this.nuevaContrasena = ''; // Reiniciar campos
    this.confirmarContrasena = '';
    this.recuperarContrasenaError = '';
    this.recuperarContrasenaSuccess = '';
    this.isChangePasswordModalOpen = true; // Abrir modal de cambio de contraseña
  }

  // Función para cambiar la contraseña
  cambiarContrasena() {
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.recuperarContrasenaError = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.isValidEmail(this.identifier)) {
      this.apiService.cambiarContrasena(this.identifier, this.nuevaContrasena).subscribe(
        response => {
          this.recuperarContrasenaSuccess = 'Contraseña cambiada exitosamente.';
          this.resetChangePasswordFields();
          this.closeChangePasswordModal(); // Cerrar el modal de cambio de contraseña
        },
        error => {
          this.recuperarContrasenaError = 'Error al cambiar la contraseña.';
        }
      );
    } else {
      this.apiService.cambiarContrasenaAdmin(this.identifier, this.nuevaContrasena).subscribe(
        response => {
          this.recuperarContrasenaSuccess = 'Contraseña del administrador cambiada exitosamente.';
          this.resetChangePasswordFields();
          this.closeChangePasswordModal(); // Cerrar el modal de cambio de contraseña
        },
        error => {
          this.recuperarContrasenaError = 'Error al cambiar la contraseña del administrador.';
        }
      );
    }
  }

  // Función para cerrar el modal de cambio de contraseña
  closeChangePasswordModal() {
    this.isChangePasswordModalOpen = false; // Cerrar modal de cambio de contraseña
  }

  // Resetear campos de contraseña
  resetChangePasswordFields() {
    this.nuevaContrasena = '';
    this.confirmarContrasena = '';
  }

  // Navegar a la página de registro
  goToRegistro() {
    this.router.navigate(['/registro-cli']);
  }
}

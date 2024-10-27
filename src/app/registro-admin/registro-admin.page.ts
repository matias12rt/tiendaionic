import { Component, OnInit } from '@angular/core';
import { ApiService } from '../servicios_db_api/api.service';
import { SqliteService } from '../servicios_db_api/sqlite.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-registro-admin',
  templateUrl: './registro-admin.page.html',
  styleUrls: ['./registro-admin.page.scss'],
})
export class RegistroAdminPage implements OnInit {
  public mensaje: string = ''; // Mensaje para el usuario

  constructor(
    private apiService: ApiService,
    private sqliteService: SqliteService
  ) { }

  ngOnInit() {
    $(document).ready(() => {
      
      $('#registrationForm').on('submit', async (event: any) => {
        event.preventDefault();
        let isValid = this.validarFormulario();
        if (isValid) {
          // Recoger datos del formulario
          const adminteData = this.obtenerDatosDelFormulario();
  
          // Verificar si el correo ya está registrado en la API
          const isCorreoRegistrado = await this.apiService.verificarCorreoadmin(adminteData.correo).toPromise();
          if (isCorreoRegistrado) {
            $('#email-error').text('Este correo ya se encuentra registrado. Intente con otro.');
            return; // Detener el registro si el correo ya está registrado
          }
  
          const isRutRegistrado = await this.apiService.verificarRutAdmin(adminteData.rut).toPromise();
          if (isRutRegistrado) {
            $('#rut-error').text('Este RUT ya se encuentra registrado. Intente con otro.');
            return;
          }
  
          // Guardar cliente en SQLite y obtener el ID
          const insertedId = await this.sqliteService.addAdmin(adminteData);
          if (insertedId) {
            adminteData.id = insertedId; // Agregar ID al objeto cliente
            console.log('Cliente guardado temporalmente en SQLite con ID:', insertedId);
          }
  
          // Intentar enviar el cliente a la API
          this.apiService.addAdmin(adminteData).subscribe(
            async response => {
              console.log('Cliente agregado a la API:', response);
              this.mensaje = 'Registro exitoso. Ya puedes usar tu cuenta.';
            
  
              // Borrar de SQLite si existía un registro temporal
              if (adminteData.id) {
                await this.sqliteService.deleteAdmin(adminteData.id);
                console.log('Cliente eliminado de SQLite');
              }
              this.limpiarFormulario();
            },
            async error => {
              console.error('Error al agregar cliente a la API, guardando en SQLite:', error);
              this.mensaje = 'Datos guardados temporalmente para esperar conexión.';
            }
          );
        }
      });
    });
  
    // Al iniciar, intentar sincronizar datos de SQLite con la API
    this.sincronizarClientesPendientes();
  }
  

  limpiarFormulario() {
    $('#name').val('');
    $('#surname').val('');
    $('#email').val('');
    $('#rut').val('');
    $('#region').val('');
    $('#comuna').val('');
    $('#password').val('');
  
    // También puedes quitar los mensajes de error si los hubiera
    $('#name-error').text('');
    $('#surname-error').text('');
    $('#email-error').text('');
    $('#rut-error').text('');
    $('#region-error').text('');
    $('#comuna-error').text('');
    $('#password-error').text('');
   
  }

  limpiarMensaje(){
    $('#mensajes').text('');
  }

  validarFormulario(): boolean {
    // Realizar todas las validaciones aquí
    let isValid = true;

    if ($('#name').val().trim() === '') {
      $('#name-error').text('El nombre es obligatorio.');
      isValid = false;
    } else {
      $('#name-error').text('');
    }

    if ($('#surname').val().trim() === '') {
      $('#surname-error').text('El apellido es obligatorio.');
      isValid = false;
    } else {
      $('#surname-error').text('');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValue = $('#email').val().toString();
    if (!emailPattern.test(emailValue)) {
      $('#email-error').text('Correo electrónico no es válido.');
      isValid = false;
    } else {
      $('#email-error').text('');
    }

    const rutValue = $('#rut').val().toString();
    if (rutValue.trim() === '') {
      $('#rut-error').text('El RUT es obligatorio.');
      isValid = false;
    } else if (!/^[0-9]+$/.test(rutValue)) {
      $('#rut-error').text('El RUT solo puede contener números.');
      isValid = false;
    }

    if ($('#region').val().trim() === '') {
      $('#region-error').text('La región es obligatoria.');
      isValid = false;
    } else {
      $('#region-error').text('');
    }

    if ($('#comuna').val().trim() === '') {
      $('#comuna-error').text('La comuna es obligatoria.');
      isValid = false;
    } else {
      $('#comuna-error').text('');
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d{4,})(?=.*[a-zA-Z]{3,}).{8,}$/;
    if (!passwordPattern.test($('#password').val().toString())) {
      $('#password-error').text('La contraseña debe contener al menos 4 números, 3 caracteres y 1 mayúscula.');
      isValid = false;
    } else {
      $('#password-error').text('');
    }

    return isValid;
  }

  obtenerDatosDelFormulario(): {
    id: number; // El ID se añadirá después
    nombre: string;
    apellido: string;
    correo: string;
    rut: string;
    region: string;
    comuna: string;
    contrasena: string
  } {
    return {
      id: 0,
      nombre: $('#name').val(),
      apellido: $('#surname').val(),
      correo: $('#email').val().toString(),
      rut: $('#rut').val(),
      region: $('#region').val(),
      comuna: $('#comuna').val(),
      contrasena: $('#password').val()
    };
  }

  async sincronizarClientesPendientes() {
    const adminPendientes = await this.sqliteService.getAdminPedientes();

    for (const admin of adminPendientes) {
      const isCorreoRegistrado = await this.apiService.verificarCorreoadmin(admin.correo).toPromise();
      const isRutRegistrado = await this.apiService.verificarRutAdmin(admin.rut).toPromise();

      if (!isCorreoRegistrado && !isRutRegistrado) {
        this.apiService.addAdmin(admin).subscribe(
          async response => {
            console.log('Administrador pendiente sincronizado con la API:', response);
            await this.sqliteService.deleteAdmin(admin.id);
            console.log('Administrador eliminado de SQLite después de sincronización.');
          },
          error => {
            console.error('Error al sincronizar administrador con la API:', error);
          }
        );
      } else {
        console.log('Correo o RUT duplicado, eliminando administrador de SQLite:', admin.correo, admin.rut);
        await this.sqliteService.deleteAdmin(admin.id);
      }
    }
  }
}

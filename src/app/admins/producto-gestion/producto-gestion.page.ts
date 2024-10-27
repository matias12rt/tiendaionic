import { Component } from '@angular/core';
import { ApiService } from '../../servicios_db_api/api.service';
import { SqliteService } from '../../servicios_db_api/sqlite.service'; 
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import * as $ from 'jquery';

@Component({
  selector: 'app-producto-gestion',
  templateUrl: './producto-gestion.page.html',
  styleUrls: ['./producto-gestion.page.scss'],
})
export class ProductoGestionPage {
  public mensaje: string = '';
  public selectedImage: string | undefined;
  fotoErrorMessage: string = '';


  constructor(
    private apiService: ApiService, 
    private sqliteService: SqliteService
  ) {}
  
 // Método para tomar una foto
 async takePicture() {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera
  });

  this.selectedImage = image.webPath; // Almacena la URL de la imagen
}

// Método para seleccionar imagen de la galería
async selectImageFromGallery() {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri,
    source: CameraSource.Photos // Seleccionar desde la galería
  });

  this.selectedImage = image.webPath; // Almacena la URL de la imagen
}

  ngOnInit() {
    // Inicializar el formulario y manejar el envío
    $(document).ready(() => {
      $('#registrationForm').on('submit', async (event: any) => {
        event.preventDefault();
        let isValid = this.validarFormulario();
        
        if (isValid) {
          // Recoger datos del formulario
          const productoData = this.obtenerDatosDelFormulario();

          // Guardar producto en SQLite y obtener el ID
          const insertedId = await this.sqliteService.addProduct(productoData);
          if (insertedId) {
            productoData.id = insertedId; // Agregar ID al objeto producto
            console.log('Producto guardado temporalmente en SQLite con ID:', insertedId);
          }

          // Intentar enviar el producto a la API
          this.apiService.addProduct(productoData).subscribe(
            async response => {
              console.log('Producto agregado a la API:', response);
              this.mensaje = 'Registro exitoso. El producto se ha registrado.';
              // Borrar de SQLite si existía un registro temporal
              if (productoData.id) {
                await this.sqliteService.deleteProduct(productoData.id);
                console.log('Producto eliminado de SQLite');
              }
              this.limpiarFormulario();
            },
            async error => {
              console.error('Error al agregar producto a la API, guardando en SQLite:', error);
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
    // Limpiar campos del formulario
    $('#nombrePro').val('');
    $('#codigoPro').val('');
    $('#precioPro').val('');
    $('#descriPro').val('');
    $('#fotoPro').val('');
    $('#cantiPro').val('');
    $('#categoPro').val('');
    
     // Limpiar el estado de la imagen seleccionada
    this.selectedImage = ''; // Resetear la imagen seleccionada

    $('#namepro-error').text('');
    $('#codigopro-error').text('');
    $('#preciopro-error').text('');
    $('#descripro-error').text('');
    $('#fotopro-error').text('');
    $('#cantipro-error').text('');
    $('#categopro-error').text('');
  }

  limpiarMensaje() {
    $('#mensajes').text('');
  }

  validarFormulario(): boolean {
    // Validar campos del formulario
    let isValid = true;

    if ($('#nombrePro').val().trim() === '') {
      $('#namepro-error').text('El nombre del producto es obligatorio.');
      isValid = false;
    } else {
      $('#namepro-error').text('');
    }

    if ($('#codigoPro').val().trim() === '') {
      $('#codigopro-error').text('El código es obligatorio.');
      isValid = false;
    } else {
      $('#codigopro-error').text('');
    }

    if ($('#precioPro').val().trim() === '') {
      $('#preciopro-error').text('El precio es obligatorio.');
      isValid = false;
    } else {
      $('#preciopro-error').text('');
    }

    if ($('#descriPro').val().trim() === '') {
      $('#descripro-error').text('La descripción es obligatoria.');
      isValid = false;
    } else {
      $('#descripro-error').text('');
    }
    
    if ($('#cantiPro').val().trim() === '') {
      $('#cantipro-error').text('La cantidad del producto es obligatoria.');
      isValid = false;
    } else {
      $('#cantipro-error').text('');
    }

    if ($('#categoPro').val().trim() === '') {
      $('#categopro-error').text('La categoría es obligatoria.');
      isValid = false;
    } else {
      $('#categopro-error').text('');
    }

    // Validar si la imagen ha sido seleccionada
    if (!this.selectedImage) {
      // Aquí puedes mostrar un mensaje de error en la interfaz
      // Por ejemplo, podrías tener un campo para mensajes de error
      this.fotoErrorMessage = 'La foto es obligatoria.'; // Cambia esto a la forma en que manejas los mensajes de error
      isValid = false;
  } else {
      this.fotoErrorMessage = ''; // Resetea el mensaje de error
  }


    return isValid;
  }
  

  obtenerDatosDelFormulario(): { 
    id: number; 
    nombre: string;
    codigo: string; 
    precio: number; 
    descripcion: string; 
    cantidad: number; 
    categoria: string;
    foto: string | undefined;
  } {
    return {
      id: 0,
      nombre: $('#nombrePro').val(),
      codigo: $('#codigoPro').val(),
      precio: parseFloat($('#precioPro').val()),  
      descripcion: $('#descriPro').val(),
      cantidad: parseInt($('#cantiPro').val(), 10),  
      categoria: $('#categoPro').val(),
      foto: this.selectedImage,  // Usar la URL de la imagen
    };
  }


  async sincronizarClientesPendientes() {
    const productosPendientes = await this.sqliteService.getProducoPedientes();
  
    for (const producto of productosPendientes) {
      this.apiService.addProduct(producto).subscribe(
        async response => {
          console.log('Producto sincronizado con la API:', response);
          await this.sqliteService.deleteProduct(producto.id);
          console.log('Producto eliminado de SQLite después de sincronización.');
        },
        error => {
          console.error('Error al sincronizar producto con la API:', error);
        }
      );
    }
  }
}

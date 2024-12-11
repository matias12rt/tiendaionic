import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios_db_api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SqliteService } from 'src/app/servicios_db_api/sqlite.service'; 
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Categoria } from '../model/categoria';
import * as $ from 'jquery';

@Component({
  selector: 'app-producto-modificar',
  templateUrl: './producto-modificar.page.html',
  styleUrls: ['./producto-modificar.page.scss'],
})
export class ProductoModificarPage implements OnInit {
  productId!: number;
  public selectedImage: string | undefined;
  public producto: any = {};  // Objeto para almacenar el producto
  fotoErrorMessage: string = '';
  categorias: Categoria[] = [];

  constructor(
    private apiService: ApiService,
    private sqliteService: SqliteService, 
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });
  
    this.selectedImage = image.webPath; // Almacena la URL de la imagen
  }
  
  async selectImageFromGallery() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });
  
    this.selectedImage = image.webPath; // Almacena la URL de la imagen
  }

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarProducto();
    this.obtenerCategorias();
  }

  obtenerCategorias() {
    this.apiService.getCategoria().subscribe(
      categorias => {
        this.categorias = categorias; // Guardar las categorías recibidas.
      },
      error => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }

   // Función para cargar el producto desde la API y almacenarlo en SQLite
   async cargarProducto() {
    try {
      const producto = await this.apiService.getProductById(this.productId).toPromise();
      
      // Verificamos si 'producto' está definido antes de asignarlo o usarlo
      if (producto) {
        this.producto = producto;
        await this.sqliteService.saveProduct(producto); // Guardar o actualizar en SQLite para persistencia
        this.asignarDatosAlFormulario(this.producto);
      } else {
        console.error('Producto no encontrado o es undefined');
      }
    } catch (error) {
      console.error('Error al cargar el producto:', error);
    }
  }
  

  // Función para asignar los valores del objeto a los campos del formulario
  asignarDatosAlFormulario(producto: any) {
    $('#nombrePro').val(producto.nombre);
    $('#codigoPro').val(producto.codigo);
    $('#precioPro').val(producto.precio);
    $('#descriPro').val(producto.descripcion);
    $('#cantiPro').val(producto.cantidad);
    $('#categoPro').val(producto.categoria);
  
    if (producto.foto) {
      this.selectedImage = producto.foto;
      $('#imagenPreview').attr('src', producto.foto);
    }
  }

  validarFormulario(): boolean {
    let isValid = true;
  
    if (String($('#nombrePro').val()).trim() === '') {
      $('#namepro-error').text('El nombre del producto es obligatorio.');
      isValid = false;
    } else {
      $('#namepro-error').text('');
    }
  
    if (String($('#codigoPro').val()).trim() === '') {
      $('#codigopro-error').text('El código es obligatorio.');
      isValid = false;
    } else {
      $('#codigopro-error').text('');
    }
  
    if (String($('#precioPro').val()).trim() === '') {
      $('#preciopro-error').text('El precio es obligatorio.');
      isValid = false;
    } else {
      $('#preciopro-error').text('');
    }
  
    if (String($('#descriPro').val()).trim() === '') {
      $('#descripro-error').text('La descripción es obligatoria.');
      isValid = false;
    } else {
      $('#descripro-error').text('');
    }
    
    if (String($('#cantiPro').val()).trim() === '') {
      $('#cantipro-error').text('La cantidad es obligatoria.');
      isValid = false;
    } else {
      $('#cantipro-error').text('');
    }
  
    if (String($('#categoPro').val()).trim() === '') {
      $('#categopro-error').text('La categoría es obligatoria.');
      isValid = false;
    } else {
      $('#categopro-error').text('');
    }
  
    if (!this.selectedImage) {
      this.fotoErrorMessage = 'La foto es obligatoria.';
      isValid = false;
    } else {
      this.fotoErrorMessage = '';
    }
  
    return isValid;
  }
  

  // Función para enviar los datos actualizados
  async onSubmit() {
    if (this.validarFormulario()) {
      const updatedProductData = {
        id: this.productId,
        nombre: $('#nombrePro').val(),
        codigo: $('#codigoPro').val(),
        precio: parseFloat($('#precioPro').val()), 
        descripcion: $('#descriPro').val(),
        cantidad: parseInt($('#cantiPro').val(), 10),
        categoria: $('#categoPro').val(),
        foto: this.selectedImage // Usar la imagen seleccionada
      };
  
      console.log('Datos de producto actualizados:', updatedProductData); // Verificar los datos
  
      try {
        // Actualizar primero en SQLite
        await this.sqliteService.updateProduct(this.productId, updatedProductData);
        console.log('Producto actualizado en SQLite.');
  
        // Luego, actualizar en la API
        const apiResponse = await this.apiService.updateProduct(this.productId, updatedProductData).toPromise();
        console.log('Respuesta de la API:', apiResponse); // Verificar si la API respondió correctamente
        
        if (apiResponse) { // Asegurarnos de que la API respondió correctamente antes de eliminar el producto de SQLite
          console.log('Producto actualizado en la API correctamente.');
          
          // Si se actualizó correctamente en la API, eliminar el producto de SQLite
          await this.sqliteService.deleteProduct(this.productId);
          console.log('Producto eliminado de SQLite después de la actualización.');
          
          // Redirigir a la página de administración
          this.router.navigate(['/administracion']);
        } else {
          console.error('La API no devolvió una respuesta válida.');
        }
  
      } catch (error) {
        console.error('Error durante la actualización:', error);
      }
    } else {
      console.log('Formulario no válido');
    }
  }
}  

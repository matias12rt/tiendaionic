import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/servicios_db_api/api.service';
import { Clproducto } from '../model/Clproducto';
import { AlertController } from '@ionic/angular';
import { AuthenticationService } from '../../gurads/authentication.service'; 

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.page.html',
  styleUrls: ['./administracion.page.scss'],
})
export class AdministracionPage implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'precio', 'codigo', 'acciones'];
  dataSource: Clproducto[] = [];

  nombreUsuario: string = '';
  rutUsuario: string = '';

  constructor(
    private router: Router,
    private apiService: ApiService, 
    private alertController: AlertController,
    private authenticationService: AuthenticationService
  
  ) {}

  ngOnInit() {
    // Recuperar los datos enviados desde el login usando NavigationExtras
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      if (navigation.extras.state['email']) {
        this.nombreUsuario = navigation.extras.state['email']; // Si se envió el correo
      }
      if (navigation.extras.state['rut']) {
        this.rutUsuario = navigation.extras.state['rut']; // Si se envió el RUT
      }
    }

    this.cargarProductos();

  
  }
  cargarProductos() {
    this.apiService.getProducts().subscribe((productos: Clproducto[]) => {
      this.dataSource = productos;
      console.log('Productos recargados');
    }, error => {
      console.error('Error al cargar los productos:', error);
    });
  }
  

  eliminarProducto(id: number) {
    this.apiService.deleteProduct(id).subscribe({
      next: () => {
        console.log('Producto eliminado con éxito'); 
      },
      error: (error) => {
        console.error('Error al eliminar el producto:', error);
      }
    });
  }

  modificarProducto(productId: number) {
    this.router.navigate(['producto-modificar', productId]);
  }

  async confirmarCerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Confirmar cierre de sesión',
      message: '¿Estás seguro de que deseas cerrar tu sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cierre de sesión cancelado');
          },
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.cerrarSesion();
            this.authenticationService.logout();

          },
        },
      ],
    });

    await alert.present();
  }

  cerrarSesion() {
    this.router.navigate(['/home']);
  }
}

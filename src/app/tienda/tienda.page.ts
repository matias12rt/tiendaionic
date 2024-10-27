import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AnimationController, Animation } from '@ionic/angular';
import { ApiService } from '../servicios_db_api/api.service'; 
import { Clproducto } from '../admins/model/Clproducto'; // El modelo de los productos
import { AlertController } from '@ionic/angular';
import { AuthenticationService } from '../gurads/authentication.service'; 
@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.page.html',
  styleUrls: ['./tienda.page.scss'],
})
export class TiendaPage implements OnInit {
  @ViewChild('cartIcon', { read: ElementRef }) cartIcon!: ElementRef;
  private addToCartAnimation!: Animation;
  products: Clproducto[] = [];  // Aquí se almacenarán los productos

  constructor(
    private animationCtrl: AnimationController,
    private apiService: ApiService,  // Inyectar el servicio de API
    private alertController: AlertController,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.getProductsFromApi();  // Llamar al método que obtiene los productos
  }

  // Método para obtener los productos desde la API
  getProductsFromApi() {
    this.apiService.getProducts().subscribe(
      (data: Clproducto[]) => {
        this.products = data;  // Guardar los productos obtenidos
      },
      (error) => {
        console.error('Error al obtener productos de la API', error);
      }
    );
  }

  addToCart(event: Event, target: EventTarget | null) {
    const productImg = target as HTMLImageElement;
  
    if (!productImg) {
      return;  // Si el target no es una imagen, no continúa la animación
    }
  
    const productRect = productImg.getBoundingClientRect();
    const cartRect = this.cartIcon.nativeElement.getBoundingClientRect();
  
    // Crear la animación para mover la imagen al carrito
    this.addToCartAnimation = this.animationCtrl.create()
      .addElement(productImg)
      .duration(800)
      .keyframes([
        { offset: 0, transform: `translate(0, 0) scale(1)`, opacity: '1' },
        { offset: 0.5, transform: `translate(${(cartRect.left - productRect.left) / 2}px, ${(cartRect.top - productRect.top) / 2}px) scale(0.5)`, opacity: '0.7' },
        { offset: 1, transform: `translate(${cartRect.left - productRect.left}px, ${cartRect.top - productRect.top}px) scale(0.2)`, opacity: '0' },
      ]);
  
    // Ejecutar la animación
    this.addToCartAnimation.play().then(() => {
      // Crear la animación para regresar la imagen a su posición original
      const resetAnimation = this.animationCtrl.create()
        .addElement(productImg)
        .duration(500)
        .keyframes([
          { offset: 0, transform: `translate(${cartRect.left - productRect.left}px, ${cartRect.top - productRect.top}px) scale(0.2)`, opacity: '0' },
          { offset: 1, transform: `translate(0, 0) scale(1)`, opacity: '1' },
        ]);
  
      resetAnimation.play();
    });
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
            this.authenticationService.logout();

          },
        },
      ],
    });

    await alert.present();
  }  
}

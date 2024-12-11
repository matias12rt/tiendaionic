import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, Animation } from '@ionic/angular';
import { ApiService } from '../servicios_db_api/api.service'; 
import { AlertController } from '@ionic/angular';
import { AuthenticationService } from '../gurads/authentication.service'; 
import { CartService } from '../servicio_carrito/cartservicio.service';
import { Categoria } from '../admins/model/categoria';
@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.page.html',
  styleUrls: ['./tienda.page.scss'],
})
export class TiendaPage implements OnInit {
  @ViewChild('cartIcon', { read: ElementRef }) cartIcon!: ElementRef;
  private addToCartAnimation!: Animation;
  products: any[] = []; // Aquí se almacenarán los productos
  cartItems: any[] = []; // Almacenar los productos del carrito
  filteredProducts: any[] = []; // Lista de productos filtrados para la búsqueda y filtros
  searchQuery: string = ''; // Almacena el texto de búsqueda
  selectedCategory: string = ''; // Almacena la categoría seleccionada
  categorias: Categoria[] = [];


  constructor(
    private animationCtrl: AnimationController,
    private apiService: ApiService,  // Inyectar el servicio de API
    private alertController: AlertController,
    private authenticationService: AuthenticationService,
    private router: Router,
    private cartService: CartService,
  ) { }

  goToCart() {
    this.router.navigate(['/carrito']);
  }

  ngOnInit() {
    this.loadProducts();  // Llamar al método que obtiene los productos
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
    // Método para buscar productos por nombre o código
searchProducts() {
  const query = this.searchQuery.toLowerCase().trim();
  this.filteredProducts = this.products.filter(product =>
    product.nombre.toLowerCase().includes(query) || 
    product.codigo.toLowerCase().includes(query)
  );
}

// Método para filtrar productos por categoría
filterByCategory() {
  if (this.selectedCategory) {
    this.filteredProducts = this.products.filter(product =>
      product.categoria.toLowerCase() === this.selectedCategory.toLowerCase()
    );
  } else {
    this.filteredProducts = [...this.products]; // Si no hay categoría seleccionada, muestra todos
  }
}

// Método combinado para buscar y filtrar al mismo tiempo
applyFilters() {
  let filtered = [...this.products];

  // Aplica la búsqueda si hay un texto en la barra de búsqueda
  if (this.searchQuery.trim()) {
    const query = this.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(product =>
      product.nombre.toLowerCase().includes(query) || 
      product.codigo.toLowerCase().includes(query)
    );
  }
 // Aplica el filtro de categoría si hay una categoría seleccionada
 if (this.selectedCategory) {
  filtered = filtered.filter(product =>
    product.categoria.toLowerCase() === this.selectedCategory.toLowerCase()
  );
}

// Actualiza los productos filtrados
this.filteredProducts = filtered;
}

loadProducts() {
  this.apiService.getProducts().subscribe(
    (data: any[]) => {
      // Mapea los productos para agregar una imagen por defecto
      this.products = data.map(product => ({
        ...product,
        foto: product.foto || 'assets/img/default-image.png' // Imagen por defecto
      }));

      // Inicializa los productos filtrados con todos los productos
      this.filteredProducts = [...this.products];
    },
    (error) => {
      console.error('Error al cargar productos desde la API:', error);
    }
  );
}


  async addToCart(product: any, event: MouseEvent) {
    const target = event.target as HTMLElement;
  
    // Busca el botón del carrito al que se hizo clic
    const cartButton = target.closest('ion-button');
    
    if (!cartButton) {
      console.error('Error: No se pudo encontrar el botón del carrito.');
      return;
    }
  
    // Primero, agregar el producto al carrito (sin animación de la imagen)
    await this.cartService.addProductToCart(product);
  
    // Animación del botón del carrito
    const animation = this.animationCtrl.create()
      .addElement(cartButton)  // Aplica la animación al botón completo
      .duration(500)
      .keyframes([
        { offset: 0, transform: 'scale(1)', opacity: '1' }, // Estado inicial
        { offset: 0.5, transform: 'scale(1.2)', opacity: '0.8' }, // Aumento de tamaño
        { offset: 1, transform: 'scale(1)', opacity: '1' } // Regresar a tamaño normal
      ]);
  
    // Reproducir la animación
    animation.play();
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

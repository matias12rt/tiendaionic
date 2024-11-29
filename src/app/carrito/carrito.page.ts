import { Component, OnInit } from '@angular/core';
import { CartService } from '../servicio_carrito/cartservicio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  cartItems: any[] = [];
  total: number = 0;

  constructor(private cartService: CartService, private router: Router) {}

  async ngOnInit() {
    await this.loadCart();
  }

  async loadCart() {
    this.cartItems = this.cartService.getCart();  // Usamos el método getCart() para obtener los productos del carrito
    this.total = this.cartService.getCartTotal();  // Calculamos el total
  }

  // Incrementa la cantidad en 1
  async increaseQuantity(item: any) {
    item.quantity += 1;
    await this.cartService.addProductToCart(item);  // Llamamos al servicio para actualizar el carrito
    await this.loadCart();  // Recargamos el carrito
  }

  // Decrementa la cantidad en 1 si es mayor que 1
  async decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      await this.cartService.addProductToCart(item);  // Llamamos al servicio para actualizar el carrito
    } else {
      await this.removeItem(item);  // Si la cantidad es 1, eliminamos el producto
    }
    await this.loadCart();  // Recargamos el carrito
  }

  // Elimina un producto del carrito
  async removeItem(item: any) {
    await this.cartService.removeProductFromCart(item.id);  // Elimina el producto
    await this.loadCart();  // Recargamos el carrito
  }

  checkout() {
    // Implementar lógica de compra
    console.log('Comprando:', this.cartItems);
  }

  volver() {
    this.router.navigate(['/tienda']);
  }
}

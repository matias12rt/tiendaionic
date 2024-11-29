import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = []; // Almacena temporalmente los productos en el carrito
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializa el almacenamiento
  async init() {
    const storage = await this.storage.create();
    this._storage = storage;

    // Cargar el carrito desde el almacenamiento al iniciar
    const savedCart = await this._storage.get('cart');
    if (savedCart) {
      this.cart = savedCart;
    }
  }

  // Agregar producto al carrito o actualizar la cantidad si ya existe
  async addProductToCart(product: any) {
    const existing = this.cart.find((item) => item.id === product.id);
    if (existing) {
      // Solo incrementa o decrementa la cantidad si ya existe
      existing.quantity = Math.max(existing.quantity, 1);  // Evitar que la cantidad sea menor a 1
    } else {
      // Si no existe, agrega el producto con cantidad 1
      this.cart.push({ ...product, quantity: 1 });
    }
    await this.saveCart();
  }

  // Eliminar producto del carrito
  async removeProductFromCart(productId: string) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    await this.saveCart();
  }

  // Vaciar el carrito
  async clearCart() {
    this.cart = [];
    await this.saveCart();
  }

  // Obtener todos los productos del carrito
  getCart() {
    return this.cart;
  }

  // Calcular el total del carrito
  getCartTotal() {
    return this.cart.reduce((total, item) => total + item.precio * item.quantity, 0);
  }

  // Guardar el carrito en el almacenamiento
  private async saveCart() {
    if (this._storage) {
      await this._storage.set('cart', this.cart);  // Guardamos el carrito en el almacenamiento de Ionic
    }
  }
}

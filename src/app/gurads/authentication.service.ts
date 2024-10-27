import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular'; // Importa el servicio de Storage

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isAuthenticated = false;

  constructor(private storage: Storage) { 
    this.init(); // Inicializar Storage
  }

  async init() {
    // Inicializa Storage antes de usarlo
    await this.storage.create();
    
    // Carga el estado de autenticación desde Storage
    const storedAuth = await this.storage.get('isAuthenticated');
    this.isAuthenticated = storedAuth === true;
  }

  // Método para iniciar sesión
  async login() {
    this.isAuthenticated = true;
    await this.storage.set('isAuthenticated', true); // Guarda el estado en Storage
  }

  // Método para cerrar sesión
  async logout() {
    this.isAuthenticated = false;
    await this.storage.set('isAuthenticated', false); // Limpia el estado en Storage
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }
}

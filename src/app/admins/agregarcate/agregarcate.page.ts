import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../../servicios_db_api/sqlite.service';
import { ApiService } from '../../servicios_db_api/api.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-agregarcate',
  templateUrl: './agregarcate.page.html',
  styleUrls: ['./agregarcate.page.scss'],
})
export class AgregarcatePage implements OnInit {
  categoria = { nombre_cate: '', descripcion: '' }; // Objeto para el formulario

  constructor(private sqliteService: SqliteService, private apiService: ApiService) {}

  ngOnInit() {}

  async agregarCategoria() {
    // Primero, validamos los campos
    if (this.validarCampos()) {
      try {
        // Paso 1: Guardar categoría en SQLite
        const insertId = await this.sqliteService.addCategoria(this.categoria);
    
        // Paso 2: Verificar si el ID ya existe en la API
        const categoriasApi = await this.apiService.getCategoria().toPromise();
    
        // Validar que `categoriasApi` sea un array antes de usarlo
        if (!Array.isArray(categoriasApi)) {
          throw new Error('La respuesta de la API no es válida.');
        }
    
        const idExiste = categoriasApi.some((cat) => cat.id === insertId);
    
        if (idExiste) {
          throw new Error('ID generado en SQLite ya existe en la API. Intente nuevamente.');
        }
    
        // Paso 3: Enviar datos a la API
        const categoriaApi = { ...this.categoria, id: insertId }; // Aseguramos que incluya el ID
        await this.apiService.addCategoria(categoriaApi).toPromise();
    
        // Paso 4: Vaciar tabla SQLite
        await this.sqliteService.deleteCategoria(insertId);
    
        // Mostrar mensaje de éxito
        console.log('Categoría enviada a la API y eliminada de SQLite.');
      } catch (error) {
        console.error('Error al agregar la categoría:', error);
      }
    }
  }

  // Validación de los campos
  validarCampos(): boolean {
    // Limpiar mensajes de error previos
    $('.error-message').remove();

    // Validar que los campos no estén vacíos
    if (!this.categoria.nombre_cate.trim()) {
      this.mostrarError('nombre_cate', 'El nombre de la categoría es obligatorio.');
      return false;
    }

    if (!this.categoria.descripcion.trim()) {
      this.mostrarError('descripcion', 'La descripción es obligatoria.');
      return false;
    }

    // Validar que los campos no contengan números
    if (/\d/.test(this.categoria.nombre_cate)) {
      this.mostrarError('nombre_cate', 'El nombre de la categoría no puede contener números.');
      return false;
    }

    if (/\d/.test(this.categoria.descripcion)) {
      this.mostrarError('descripcion', 'La descripción no puede contener números.');
      return false;
    }

    return true;
  }

  // Función para mostrar el mensaje de error debajo del campo
  mostrarError(campo: string, mensaje: string): void {
    const inputField = $(`input[name=${campo}], textarea[name=${campo}]`);
    inputField.after(`<div class="error-message" style="color: red;">${mensaje}</div>`);
  }
}

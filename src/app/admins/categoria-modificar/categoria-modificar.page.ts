import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../servicios_db_api/api.service';
import { SqliteService } from '../../servicios_db_api/sqlite.service';
import { AlertController } from '@ionic/angular';
import * as $ from 'jquery';

@Component({
  selector: 'app-categoria-modificar',
  templateUrl: './categoria-modificar.page.html',
  styleUrls: ['./categoria-modificar.page.scss'],
})
export class CategoriaModificarPage implements OnInit {
  categoria: { id: string; nombre_cate: string; descripcion: string } = {
    id: '',
    nombre_cate: '',
    descripcion: ''
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sqliteService: SqliteService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.cargarCategoria(params['id']);
      }
    });
  }

  cargarCategoria(id: string) {
    this.apiService.getCategoria().subscribe({
      next: (categorias) => {
        const categoriaEncontrada = categorias.find((cat) => cat.id.toString() === id);
        if (categoriaEncontrada) {
          this.categoria = {
            id: categoriaEncontrada.id.toString(),
            nombre_cate: categoriaEncontrada.nombre_cate,
            descripcion: categoriaEncontrada.descripcion,
          };
        }
      },
      error: (err) => console.error('Error al cargar la categoría:', err),
    });
  }

  // Validación antes de modificar la categoría
  async modificarCategoria() {
    if (this.validarCampos()) {
      const alert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Está seguro de guardar los cambios?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Modificación cancelada');
            }
          },
          {
            text: 'Guardar',
            handler: () => {
              // Aquí va el flujo de modificación
              console.log('Categoría modificada:', this.categoria);
            }
          }
        ]
      });

      await alert.present();
    }
  }

  // Validaciones de los campos
  validarCampos(): boolean {
    const nombreValido = /^[a-zA-Z\s]+$/.test(this.categoria.nombre_cate);
    const descripcionValida = /^[a-zA-Z\s]+$/.test(this.categoria.descripcion);

    if (!this.categoria.nombre_cate.trim() || !this.categoria.descripcion.trim()) {
      console.error('Los campos no pueden estar vacíos.');
      return false;
    }

    if (!nombreValido || !descripcionValida) {
      console.error('Los campos no pueden contener números.');
      return false;
    }

    return true;
  }
}

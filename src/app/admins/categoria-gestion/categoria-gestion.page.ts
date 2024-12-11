import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../servicios_db_api/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-categoria-gestion',
  templateUrl: './categoria-gestion.page.html',
  styleUrls: ['./categoria-gestion.page.scss'],
})
export class CategoriaGestionPage implements OnInit {
  categorias: { id: string; nombre_cate: string; descripcion: string }[] = [];

  constructor(private apiService: ApiService,
    private router: Router  ) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.apiService.getCategoria().subscribe({
      next: (categorias) => {
        // Convertir id a string
        this.categorias = categorias.map((categoria) => ({
          ...categoria,
          id: categoria.id.toString(),
        }));
      },
      error: (err) => {
        console.error('Error al cargar las categorías:', err);
      },
    });
  }

  eliminarCategoria(id: string) {
    this.apiService.deleteCategoria(+id).subscribe({
      next: () => {
        this.categorias = this.categorias.filter((cat) => cat.id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar la categoría:', err);
      },
    });
  }

  agregarCategoria() {
    this.router.navigate(['/agregarcate']);
  }

  modificarCategoria(categoria: { id: string; nombre_cate: string; descripcion: string }) {
    // Navega a la página de modificación con el ID de la categoría como parámetro
    this.router.navigate(['/categoria-modificar'], { queryParams: { id: categoria.id } });
  }  
}

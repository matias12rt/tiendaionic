export class Clproducto {
  id: number;
  nombre: string;
  codigo: string;
  precio: number;
  descripcion: string;
  foto: string | undefined;
  cantidad: number;
  categoria: string;

  constructor(obj: any) {
    this.id = obj && obj.id || null;
    this.nombre = obj && obj.nombre || '';
    this.codigo = obj && obj.codigo || '';
    this.precio = obj && obj.precio || 0;
    this.descripcion = obj && obj.descripcion || '';
    this.foto = obj && obj.foto;  
    this.cantidad = obj && obj.cantidad || 0;
    this.categoria = obj && obj.categoria || '';
  }
}

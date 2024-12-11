export class Categoria {
    id: number;
    nombre_cate: string;
    descripcion: string;

    constructor(obj: any) {
        this.id = obj && obj.id || null;
        this.nombre_cate = obj && obj.nombre_cate || '';
        this.descripcion = obj && obj.descripcion || '';
    }
}
export class Admin {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    rut: string;
    region: string;
    comuna: string;
    contrasena: string;

    constructor(obj: any) {
        this.id = obj && obj.id || null;
        this.nombre = obj && obj.nombre || '';
        this.apellido = obj && obj.apellido || '';
        this.correo = obj && obj.correo || '';
        this.rut = obj && obj.rut || '';
        this.region = obj && obj.region || '';
        this.comuna = obj && obj.comuna || '';
        this.contrasena = obj && obj.contrasena || '';
    }
}

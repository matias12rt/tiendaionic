import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { Clproducto } from '../admins/model/Clproducto';
@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  
  private databaseObj: SQLiteObject | null = null;

  //asignamos el nombre de la BD
  readonly db_name: string = "app_db.db";
  
  constructor(private sqlite: SQLite, private platform: Platform, private toastCtrl: ToastController) {
    this.platform.ready().then(() => {
      this.createDatabase();
    });
  }

  // Creacion de la base de datos........
  async createDatabase() {
    try {
      this.databaseObj = await this.sqlite.create({
        name: this.db_name,
        location: 'default'
      });
      this.createTables();
    } catch (e) {
      this.presentToast('Error creando la base de datos: ' + JSON.stringify(e));
    }
  }

  // Creacion de las tablas que se usaran para BD.....

  async createTables() {
    if (this.databaseObj) {
      try {
        await this.databaseObj.executeSql(`
        CREATE TABLE IF NOT EXISTS producto (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          codigo TEXT NOT NULL,
          precio REAL NOT NULL,
          descripcion TEXT,
          foto TEXT NOT NULL,
          cantidad INTEGER NOT NULL,
          categoria TEXT NOT NULL
        );`, []);
        await this.databaseObj.executeSql(`
          CREATE TABLE IF NOT EXISTS cliente (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            apellido TEXT NOT NULL,
            correo TEXT NOT NULL UNIQUE,
            region TEXT NOT NULL,
            comuna TEXT NOT NULL,
            contrasena TEXT NOT NULL
          );`, []);
          await this.databaseObj.executeSql(`
            CREATE TABLE IF NOT EXISTS admin (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nombre TEXT NOT NULL,
              apellido TEXT NOT NULL,
              correo TEXT NOT NULL UNIQUE,
              rut TEXT NOT NULL UNIQUE,
              region TEXT NOT NULL,
              comuna TEXT NOT NULL,
              contrasena TEXT NOT NULL
            );`, []);
          await this.databaseObj.executeSql(`
            CREATE TABLE IF NOT EXISTS categoria(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre_cate TEXT NOT NULL,
            descripcion TEXT
            );`, []);
        this.presentToast('Tablas creadas con éxito');
      } catch (e) {
        this.presentToast('Error al crear las tablas: ' + JSON.stringify(e));
      }
    } else {
      this.presentToast('Error: base de datos no inicializada');
    }
  }

//++++++++++++++++++++++++++++++ CATEGORIA ++++++++++++++++++++++++++++++++++++++++++++
async addCategoria(categoria:{
  nombre_cate:string;
  descripcion: string;
}){
  if (this.databaseObj) {
    try{
      const result = await this.databaseObj.executeSql(
        `INSERT INTO categoria (nombre_cate, descripcion) VALUES(?,?) `,
        [categoria.nombre_cate, categoria.descripcion]
      );
      return result.insertId;
    }catch(e){
      this.presentToast('Error al insertar categoria:'+ JSON.stringify(e));
    }
  }else{
    this.presentToast('Error: base de datos no inicializada');
  }

}
async deleteCategoria(id: number): Promise<void> {
  if (this.databaseObj) {
    try {
      await this.databaseObj.executeSql(`DELETE FROM categoria WHERE id = ?`, [id]);
      this.presentToast('categoria eliminado con éxito');
    } catch (e) {
      this.presentToast('Error al eliminar la categoria: ' + JSON.stringify(e));
    }
  } else {
    this.presentToast('Error: base de datos no inicializada');
  }
}

async deleteAllCategorias(): Promise<void> {
  if (this.databaseObj) {
    try {
      await this.databaseObj.executeSql(`DELETE FROM categoria`);
      this.presentToast('Tabla de categorías vaciada.');
    } catch (e) {
      this.presentToast('Error al vaciar la tabla de categorías: ' + JSON.stringify(e));
    }
  } else {
    this.presentToast('Error: base de datos no inicializada');
  }
}

//+++++++++++++++++++++++++++++++++++ CLIENTE +++++++++++++++++++++++++++++++++++++++++++++++++++++

//-------------------- METODO PARA AGREGAR AL CLIENTE ---------------------
async addCliente(cliente: { 
  nombre: string; 
  apellido: string; 
  correo: string; 
  region: string; 
  comuna: string; 
  contrasena: string 
}) {
  if (this.databaseObj) {
    try {
      const result = await this.databaseObj.executeSql(
        `INSERT INTO cliente (nombre, apellido, correo, region, comuna, contrasena) VALUES (?, ?, ?, ?, ?, ?)`, 
        [cliente.nombre, cliente.apellido, cliente.correo, cliente.region, cliente.comuna, cliente.contrasena]
      );
      return result.insertId;  // Devolver el ID generado por SQLite
    } catch (e) {
      this.presentToast('Error al insertar el cliente: ' + JSON.stringify(e));
    }
  } else {
    this.presentToast('Error: base de datos no inicializada');
  }
}

//---------------------------- METODO PARA AGREGAR A LOS CLIENTES QUE QUEDAN PEDIENTES--------------------

async getClientesPendientes(): Promise<any[]> {
  const clientesPendientes: any[] = [];
  
  if (this.databaseObj) {
    try {
      const result = await this.databaseObj.executeSql(`SELECT * FROM cliente`, []);
      if (result.rows.length > 0) {
        for (let i = 0; i < result.rows.length; i++) {
          clientesPendientes.push(result.rows.item(i));
        }
      }
    } catch (e) {
      console.error('Error al obtener clientes pendientes: ', JSON.stringify(e));
    }
  } else {
    console.error('Error: base de datos no inicializada');
  }

  return clientesPendientes;
}

//------------------- METODO PARA ELIMINAR AL CLIENTE DE LA BD ---------------------------

async deleteCliente(id: number): Promise<void> {
    if (this.databaseObj) {
      try {
        await this.databaseObj.executeSql(`DELETE FROM cliente WHERE id = ?`, [id]);
        this.presentToast('Cliente eliminado con éxito');
      } catch (e) {
        this.presentToast('Error al eliminar el cliente: ' + JSON.stringify(e));
      }
    } else {
      this.presentToast('Error: base de datos no inicializada');
    }
  }
//++++++++++++++++++++++++++++++++ ADMIN ++++++++++++++++++++++++++++++++++++++++++++++++++++

//---------------------------- METODO PARA AGREGAR AL ADMIN A LA BD -------------------------
  async addAdmin(admin:{
    nombre: string;
    apellido: string;
    correo: string;
    rut: string;
    region: string;
    comuna: string;
    contrasena: string;
  }) {
    if (this.databaseObj) {
        try {
            const result = await this.databaseObj.executeSql(
                `INSERT INTO admin (nombre, apellido, correo, rut, region, comuna, contrasena) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [admin.nombre, admin.apellido, admin.correo, admin.rut, admin.region, admin.comuna, admin.contrasena]
            );
            return result.insertId;  // Devolver el ID generado por SQLite
        } catch (e) {
            this.presentToast('Error al insertar el administrador: ' + JSON.stringify(e));
        }
    } else {
        this.presentToast('Error: base de datos no inicializada');
    }
}

//---------------------------------- METODO PARA AGREGAR A LOS ADMIN PENDIENTES-----------------

async getAdminPedientes(): Promise<any[]> {
  const adminPedientes: any[] = [];

  if(this.databaseObj){
    try{
      const result = await this.databaseObj.executeSql(`SELECT * FROM admin`, []);
      if (result.rows.length > 0){
        for(let i = 0; i< result.rows.length; i++){
          adminPedientes.push(result.rows.item(i));
        }
      }
    }catch (e) {
      console.error('Error al obtener el admin pediente: ', JSON.stringify(e));
    }
  }else {
    console.error('Error: base de datos no inicializada')
  }
  return adminPedientes;
}

//------------------------------- METODO PARA ELIMINAR A LOS ADMINS DE LA BD---------------------

async deleteAdmin(id: number): Promise<void> {
  if (this.databaseObj) {
      try {
          await this.databaseObj.executeSql(`DELETE FROM admin WHERE id = ?`, [id]);
          this.presentToast('Administrador eliminado con éxito');
      } catch (e) {
          this.presentToast('Error al eliminar el administrador: ' + JSON.stringify(e));
      }
  } else {
      this.presentToast('Error: base de datos no inicializada');
  }
}


//++++++++++++++++++++++++++++ PRODUCTO +++++++++++++++++++++++++++++++

//---------------------------- METODO PARA AGREGAR A LOS PRODUCTOS PENDIENTES--------------------

async getProducoPedientes(): Promise<any[]> {
  const productoPediente: any[] = [];

  if(this.databaseObj){
    try{
      const result = await this.databaseObj.executeSql(`SELECT * FROM producto`, []);
      if (result.rows.length > 0){
        for(let i = 0; i< result.rows.length; i++){
          productoPediente.push(result.rows.item(i));
        }
      }
    }catch (e) {
      console.error('Error al obtener el admin pediente: ', JSON.stringify(e));
    }
  }else {
    console.error('Error: base de datos no inicializada')
  }
  return productoPediente;
}

//---------------------------- METODO PARA AGREGAR UN PRODUCTO A LA BD -------------------------------

async addProduct(product: {
  nombre: string;
  codigo: string;
  precio: number;
  descripcion: string;
  foto: string | undefined;
  cantidad: number;
  categoria: string;
}) {
  if (this.databaseObj) {
    try {
      const result = await this.databaseObj.executeSql(
        `INSERT INTO producto (nombre, codigo, precio, descripcion, foto, cantidad, categoria)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [product.nombre, product.codigo, product.precio, product.descripcion, product.foto, product.cantidad, product.categoria]
      );
      return result.insertId;
    } catch (e) {
      console.error('Error al insertar el producto: ' + JSON.stringify(e));
    }
  } else {
    console.error('Error: base de datos no inicializada');
  }
}
  
//----------------------- METODO PARA MODIFICAR UN PRODUCTO ----------------

async updateProduct(id: number, product: Clproducto) {
    if (this.databaseObj) {
      try {
        await this.databaseObj.executeSql(`
          UPDATE producto 
          SET nombre = ?, codigo = ?, precio = ?, descripcion = ?, foto = ?, cantidad = ?, categoria = ? 
          WHERE id = ?`, [
            product.nombre,
            product.codigo,
            product.precio,
            product.descripcion,
            product.foto,
            product.cantidad,
            product.categoria,
            id
          ]);
        this.presentToast('Producto actualizado con éxito');
      } catch (e) {
        this.presentToast('Error al actualizar producto: ' + JSON.stringify(e));
      }
    } else {
      this.presentToast('Error: base de datos no inicializada');
    }
  }
  
//-------------------------- METODO PARA MANTENER EL ID DEL PRODUCTO EN LA BD --------------

  async saveProduct(product: Clproducto) {

    if (product.id) {
      return await this.updateProduct(product.id, product);
    } else {
      return await this.addProduct(product);
    }
  }
 


  async getAllProducts() {
    if (this.databaseObj) {
      let products = [];
      try {
        const res = await this.databaseObj.executeSql(`SELECT * FROM producto`, []);
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            products.push(res.rows.item(i));
          }
        }
        return products;
      } catch (e) {
        this.presentToast('Error al obtener productos: ' + JSON.stringify(e));
        return [];
      }
    } else {
      this.presentToast('Error: base de datos no inicializada');
      return [];
    }
  }

//--------------------- METODO PARA ELIMINAR UN PRODUCTO -------------------------

  async deleteProduct(id: number) {
    if (this.databaseObj) {
      try {
        await this.databaseObj.executeSql(`DELETE FROM producto WHERE id = ?`, [id]);
        this.presentToast('Producto eliminado con éxito');
      } catch (e) {
        this.presentToast('Error al eliminar producto: ' + JSON.stringify(e));
      }
    } else {
      this.presentToast('Error: base de datos no inicializada');
    }
  }


//++++++++++++++++++++++++++++ ESTRUCTURA DE MENSAJES ++++++++++++++++++++++++++++++++++++++

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }


}
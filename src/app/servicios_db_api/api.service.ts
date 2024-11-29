import { Injectable } from '@angular/core';
import { Usuario } from '../clases/Clusuarios';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of} from 'rxjs';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Clproducto } from '../admins/model/Clproducto';
import { Admin } from '../clases/Cladmin';


// ----- VARIABLES -------------------
const apiUrl = 'http://192.168.35.234:3000';
const httpOptions = {headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }; 

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) {}

//+++++++++++++++++++ MANEJO DE ERRORES ++++++++++++++++++++++++++++++

  private handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error("Error ", error);
      return of(result as T);
    }  
  }

//++++++++++++++++++++++++++++++ PRODUCTOS ++++++++++++++++++++++++++++++++++++++++++++

//------------------------- METODO AGREGAR PRODUCTOS A LA API ------------------------

  addProduct(product: Clproducto): Observable<Clproducto> {
    return this.http.post<Clproducto>(apiUrl + "/productos", product, httpOptions).pipe(
      tap((newProduct: Clproducto) => console.log(`Producto agregado con id=${newProduct.id}`)),
      catchError(this.handleError<Clproducto>('addProduct'))
    );
  }

//---------------------- METODO PARA LLAMAR A LOS PRODUCTOS DE LA API ----------------------------------

  getProducts(): Observable<Clproducto[]>{
    return this.http.get<Clproducto[]>(apiUrl+ "/productos")
    .pipe(
      tap(heroes => console.log('productos')),
      catchError(this.handleError('get productos', []))
    );
  }

//----------------------------- METODO PARA LLAMAR A UN PRODUCTO EN ESPECIAL -------------

    // Agregar método para obtener un producto por su ID
    getProductById(id: number): Observable<Clproducto> {
      const url = `${apiUrl}/productos/${id}`;
      return this.http.get<Clproducto>(url).pipe(
        tap(_ => console.log(`Producto obtenido id=${id}`)),
        catchError(this.handleError<Clproducto>(`getProductById id=${id}`))
      );
    }

//----------------------------- METODO PARA MODIFICAR UN PRODUCTO -------------------------------------

    updateProduct(id: number, product: Clproducto): Observable<Clproducto> {
      return this.http.put<Clproducto>(`${apiUrl}/productos/${id}`, product, httpOptions)
          .pipe(
              tap(_ => console.log(`Producto actualizado id=${id}`)),
              catchError(this.handleError<Clproducto>('updateProduct'))
          );
        }
//----------------------------------- METODO PARA ELIMINAR UN PRODUCTO -----------------------

        deleteProduct(id: number): Observable<void> {
          const url = `${apiUrl}/productos/${id}`; // Usar parámetro de consulta en lugar de ruta
          return this.http.delete<void>(url, httpOptions).pipe(
            tap(() => console.log(`Producto eliminado con id=${id}`)),
            catchError(this.handleError<void>('deleteProduct'))
          );
        }
        
//+++++++++++++++++++++++++++++++++++ USUARIOS +++++++++++++++++++++++++++


//------------------------ METODO PARA AGREGAR UN USUARIO CLIENTE----------------------------
    addusuario(usuario: Usuario): Observable<Usuario>{
      return this.http.post<Usuario>(apiUrl+ "/usuarios", usuario, httpOptions).pipe(
        tap((newUsuario: Usuario) => console.log(`usuario agregado con id=${newUsuario.id}`)),
        catchError(this.handleError<Usuario>('addUsurios'))
      )
    }

//--------------------------- METODO PARA CAMBIAR LA CONTRASEÑA --------------------------------
    cambiarContrasena(correo: string, nuevaContrasena: string): Observable<any> {
      return this.http.put<any>(`${apiUrl}/usuarios?=${correo}`, { contrasena: nuevaContrasena }, httpOptions).pipe(
        catchError(this.handleError<any>('cambiarContrasena'))
      );
    }

//---------------------------- METODO PARA VERIFICAR EL CORREO DE UN CLIENTE USUARIO-------------------

    verificarCorreo(correo: string): Observable<boolean> {
      return this.http.get<Usuario[]>(`${apiUrl}/usuarios?correo=${correo}`).pipe(
        map(usuarios => usuarios.length > 0), // Retorna true si hay al menos un usuario con ese correo
        catchError(this.handleError<boolean>('verificarCorreo', false))
      );
    }

      // Verificar si el usuario existe con correo y contraseña
      verificarUsuario(correo: string, contrasena: string): Observable<boolean> {
        return this.http.get<Usuario[]>(`${apiUrl}/usuarios?correo=${correo}&contrasena=${contrasena}`).pipe(
          map(usuarios => usuarios.length > 0), // Verifica si existe un usuario con esas credenciales
          catchError(this.handleError<boolean>('verificarUsuario', false))
        );
      }
      
//+++++++++++++++++++++++++++++++++++ ADMINS +++++++++++++++++++++++++++++++++++++++++++

//------------------------- METODO PARA AGREGAR UN ADMIN -------------------------------
    addAdmin(admin: Admin): Observable<Admin> {
      return this.http.post<Admin>(apiUrl + "/admins", admin, httpOptions).pipe(
        tap((newAdmin: Admin) => console.log(`Administrador agregado con id=${newAdmin.id}`)),
        catchError(this.handleError<Admin>('addAdmin'))
      );
    }
//--------------------------- METODO PARA CAMBIAR LA CONTRASEÑA DEL ADMIN --------------------------------
    cambiarContrasenaAdmin(correo: string, nuevaContrasena: string): Observable<any> {
      return this.http.put<any>(`${apiUrl}/admins/${correo}`, { contrasena: nuevaContrasena }, httpOptions).pipe(
        catchError(this.handleError<any>('cambiarContrasenaAdmin'))
      );
    }

//----------------------- METODO PARA VERIFICAR EL CORREO ------------------------------------

    verificarCorreoadmin(correo: string): Observable<boolean> {
      return this.http.get<Admin[]>(`${apiUrl}/admins?correo=${correo}`).pipe(
        map(admins => admins.length > 0), // Retorna true si hay al menos un administrador con ese correo
        catchError(this.handleError<boolean>('verificarCorreo', false))
      );
    }

//---------------------------- METODO PARA VERIFICAR EL RUT -------------------------------

    verificarRutAdmin(rut: string): Observable<boolean>{
      return this.http.get<Admin[]>(`${apiUrl}/admins?rut=${rut}`).pipe(
        map(admins => admins.length > 0), // Retorna true si hay al menos un administrador con ese correo
        catchError(this.handleError<boolean>('verificarCorreo', false))
      );
    }

//-------------------------------- METODO PARA VERFICAR RUT Y CONTRASEÑA --------------------------

    verificarAdmin(rut: string, contrasena: string): Observable<boolean> {
      return this.http.get<Admin[]>(`${apiUrl}/admins?rut=${rut}&contrasena=${contrasena}`).pipe(
        map(admins => admins.length > 0), // Verifica si hay un administrador con esas credenciales
        catchError(this.handleError<boolean>('verificarAdmin', false))
      );
    }
    
    
}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { autenticarGuard } from './gurads/autenticar.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'tienda',
    loadChildren: () => import('./tienda/tienda.module').then( m => m.TiendaPageModule),
    canActivate: [autenticarGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro-cli',
    loadChildren: () => import('./registro-cli/registro-cli.module').then( m => m.RegistroCliPageModule)
  },
  {
    path: 'administracion',
    loadChildren: () => import('./admins/administracion/administracion.module').then(m => m.AdministracionPageModule),
    canActivate: [autenticarGuard] // Aplica el guard aquí
  },
  {
    path: 'producto-gestion',
    loadChildren: () => import('./admins/producto-gestion/producto-gestion.module').then(m => m.ProductoGestionPageModule),
    canActivate: [autenticarGuard] // Aplica el guard aquí
  },
  {
    path: 'registro-admin',
    loadChildren: () => import('./registro-admin/registro-admin.module').then( m => m.RegistroAdminPageModule)
  },
  {
    path: 'producto-modificar/:id',
    loadChildren: () => import('./admins/producto-modificar/producto-modificar.module').then(m => m.ProductoModificarPageModule),
    canActivate: [autenticarGuard] // Aplica el guard aquí
  },
  {
    path: 'carrito',
    loadChildren: () => import('./carrito/carrito.module').then( m => m.CarritoPageModule),
    canActivate: [autenticarGuard] // Aplica el guard aquí
  },
  {
    path: 'pedidos',
    loadChildren: () => import('./pedidos/pedidos.module').then( m => m.PedidosPageModule),
    canActivate: [autenticarGuard] // Aplica el guard aquí
  },
  {
    path: '**', // Ruta wildcard para el error 404
    component: PageNotFoundComponent
  },
 
 
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

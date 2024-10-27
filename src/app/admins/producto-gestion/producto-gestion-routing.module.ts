import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductoGestionPage } from './producto-gestion.page';

const routes: Routes = [
  {
    path: '',
    component: ProductoGestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductoGestionPageRoutingModule {}

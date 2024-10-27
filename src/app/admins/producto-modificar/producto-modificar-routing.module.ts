import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductoModificarPage } from './producto-modificar.page';

const routes: Routes = [
  {
    path: '',
    component: ProductoModificarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductoModificarPageRoutingModule {}

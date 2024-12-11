import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriaModificarPage } from './categoria-modificar.page';

const routes: Routes = [
  {
    path: '',
    component: CategoriaModificarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriaModificarPageRoutingModule {}

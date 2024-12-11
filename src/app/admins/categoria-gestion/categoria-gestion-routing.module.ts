import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriaGestionPage } from './categoria-gestion.page';

const routes: Routes = [
  {
    path: '',
    component: CategoriaGestionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriaGestionPageRoutingModule {}

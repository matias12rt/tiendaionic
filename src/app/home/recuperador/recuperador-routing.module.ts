import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperadorPage } from './recuperador.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperadorPageRoutingModule {}

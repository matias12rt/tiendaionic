import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroCliPage } from './registro-cli.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroCliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroCliPageRoutingModule {}

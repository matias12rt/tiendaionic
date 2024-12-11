import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarcatePage } from './agregarcate.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarcatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarcatePageRoutingModule {}

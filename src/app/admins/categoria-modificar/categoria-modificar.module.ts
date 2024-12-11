import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriaModificarPageRoutingModule } from './categoria-modificar-routing.module';

import { CategoriaModificarPage } from './categoria-modificar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriaModificarPageRoutingModule
  ],
  declarations: [CategoriaModificarPage]
})
export class CategoriaModificarPageModule {}

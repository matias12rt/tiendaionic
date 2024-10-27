import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular';

import { ProductoModificarPageRoutingModule } from './producto-modificar-routing.module';

import { ProductoModificarPage } from './producto-modificar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductoModificarPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ProductoModificarPage]
})
export class ProductoModificarPageModule {}

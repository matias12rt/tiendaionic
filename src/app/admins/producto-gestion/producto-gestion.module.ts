import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular';

import { ProductoGestionPageRoutingModule } from './producto-gestion-routing.module';

import { ProductoGestionPage } from './producto-gestion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductoGestionPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ProductoGestionPage]
})
export class ProductoGestionPageModule {}

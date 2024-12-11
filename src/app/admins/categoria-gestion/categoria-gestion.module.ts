import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoriaGestionPageRoutingModule } from './categoria-gestion-routing.module';

import { CategoriaGestionPage } from './categoria-gestion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoriaGestionPageRoutingModule
  ],
  declarations: [CategoriaGestionPage]
})
export class CategoriaGestionPageModule {}

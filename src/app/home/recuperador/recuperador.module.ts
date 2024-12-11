import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperadorPageRoutingModule } from './recuperador-routing.module';

import { RecuperadorPage } from './recuperador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperadorPageRoutingModule
  ],
  declarations: [RecuperadorPage]
})
export class RecuperadorPageModule {}

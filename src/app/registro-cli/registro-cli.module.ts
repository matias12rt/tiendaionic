import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroCliPageRoutingModule } from './registro-cli-routing.module';

import { RegistroCliPage } from './registro-cli.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroCliPageRoutingModule
  ],
  declarations: [RegistroCliPage]
})
export class RegistroCliPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PositivePageRoutingModule } from './positive-routing.module';

import { PositivePage } from './positive.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PositivePageRoutingModule
  ],
  declarations: [PositivePage]
})
export class PositivePageModule {}

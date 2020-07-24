import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NegativePageRoutingModule } from './negative-routing.module';

import { NegativePage } from './negative.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NegativePageRoutingModule
  ],
  declarations: [NegativePage]
})
export class NegativePageModule {}

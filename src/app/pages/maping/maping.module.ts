import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapingPageRoutingModule } from './maping-routing.module';

import { MapingPage } from './maping.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapingPageRoutingModule
  ],
  declarations: [MapingPage]
})
export class MapingPageModule {}

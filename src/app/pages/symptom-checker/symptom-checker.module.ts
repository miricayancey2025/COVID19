import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SymptomCheckerPageRoutingModule } from './symptom-checker-routing.module';
import { SymptomCheckerPage } from './symptom-checker.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SymptomCheckerPageRoutingModule
  ],
  declarations: [SymptomCheckerPage]
})
export class SymptomCheckerPageModule {}

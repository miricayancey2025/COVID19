import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SymptomCheckerPage } from './symptom-checker.page';

const routes: Routes = [
  {
    path: '',
    component: SymptomCheckerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SymptomCheckerPageRoutingModule {}

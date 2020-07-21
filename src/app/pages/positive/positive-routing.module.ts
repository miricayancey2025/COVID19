import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PositivePage } from './positive.page';

const routes: Routes = [
  {
    path: '',
    component: PositivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PositivePageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NegativePage } from './negative.page';

const routes: Routes = [
  {
    path: '',
    component: NegativePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NegativePageRoutingModule {}

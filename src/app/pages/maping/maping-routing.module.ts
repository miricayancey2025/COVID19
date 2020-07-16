import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapingPage } from './maping.page';

const routes: Routes = [
  {
    path: '',
    component: MapingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapingPageRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';
import { SchedulePage } from '../schedule/schedule';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'schedule',
        children: [
          {
            path: '',
            component: SchedulePage,
          },
        ]
      },
      {
        path: 'map',
        children: [
          {
            path: '',
            loadChildren: () => import('../map/map.module').then(m => m.MapModule)
          }
        ]
      },
      {
        path: 'maping',
        children: [
          {
            path: '',
            loadChildren: () => import('../maping/maping.module').then(m => m.MapingPageModule)
          }
        ]
      },
      {
        path: 'announcements',
        children: [
          {
            path: '',
            loadChildren: () => import('../announcements/announcements.module').then(m => m.AnnouncementsPageModule)
          }
        ]
      },
      {
        path: 'symptoms',
        children: [
          {
            path: '',
            loadChildren: () => import('../symptom-checker/symptom-checker.module').then(m => m.SymptomCheckerPageModule)
          }
        ]
      },
      
      {
        path: '',
        redirectTo: '/app/tabs/schedule',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }


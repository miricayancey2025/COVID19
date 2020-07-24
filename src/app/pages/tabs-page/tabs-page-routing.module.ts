import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';

//Creates the pages that the tab app recognizes and can navigate too
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
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
        path: 'positive',
        children: [
          {
            path: '',
            loadChildren: () => import('../positive/positive.module').then(m => m.PositivePageModule)
          }
        ]
      },

      {
        path: 'negative',
        children: [
          {
            path: '',
            loadChildren: () => import('../negative/negative.module').then(m => m.NegativePageModule)
          }
        ]
      },
      
      {
        path: '',
        redirectTo: '/app',
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


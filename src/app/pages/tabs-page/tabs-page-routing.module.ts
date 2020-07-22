import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';

//Creates the pages that the tab app recognizes and can navigate too
const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
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
        path: 'maping',
        children: [
          {
            path: '',
            loadChildren: () => import('../maping/maping.module').then(m => m.MapingPageModule)
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
        path: 'support',
        children: [
          {
            path: '',
            loadChildren: () => import('../support/support.module').then(m => m.SupportModule)
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
        redirectTo: 'maping',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'maping',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }


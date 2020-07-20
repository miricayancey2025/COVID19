import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';


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


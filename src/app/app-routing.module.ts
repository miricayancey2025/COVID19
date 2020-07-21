import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './services/check-tutorial.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then(m => m.SupportModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./userlog/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./userlog/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./userlog/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./userlog/verify-email/verify-email.module').then(m => m.VerifyEmailPageModule)
  },
  {
    path: 'app',
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialModule),
    canLoad: [CheckTutorial]
  },
  {
    path: 'symptom-checker',
    loadChildren: () => import('./pages/symptom-checker/symptom-checker.module').then( m => m.SymptomCheckerPageModule)
  },
  {
    path: 'announcements',
    loadChildren: () => import('./pages/announcements/announcements.module').then( m => m.AnnouncementsPageModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then( m => m.SupportModule)
  },
  {
    path: 'maping',
    loadChildren: () => import('./pages/maping/maping.module').then( m => m.MapingPageModule)
  }

 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

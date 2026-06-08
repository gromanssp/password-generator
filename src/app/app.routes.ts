import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'generator', pathMatch: 'full' },
      {
        path: 'generator',
        title: 'Password Generator',
        loadComponent: () => import('./pages/generator/generator.component').then(m => m.GeneratorComponent),
      },
      {
        path: 'strength',
        title: 'Password Strength Analyzer',
        loadComponent: () => import('./pages/strength/strength.component').then(m => m.StrengthComponent),
      },
      {
        path: 'hacking-sim',
        title: 'Hacking Simulation',
        loadComponent: () => import('./pages/hacking-sim/hacking-sim.component').then(m => m.HackingSimComponent),
      },
      {
        path: 'passphrase',
        title: 'Passphrase Generator',
        loadComponent: () => import('./pages/passphrase/passphrase.component').then(m => m.PassphraseComponent),
      },
      {
        path: 'history',
        title: 'Password History',
        loadComponent: () => import('./pages/history/history.component').then(m => m.HistoryComponent),
      },
      {
        path: 'dashboard',
        title: 'Security Dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'privacy',
        title: 'Privacy Policy',
        loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent),
      },
      {
        path: 'terms',
        title: 'Terms of Service',
        loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'generator' },
];

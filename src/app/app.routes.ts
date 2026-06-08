import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'generator', pathMatch: 'full' },
      { path: 'generator', loadComponent: () => import('./pages/generator/generator.component').then(m => m.GeneratorComponent) },
      { path: 'strength', loadComponent: () => import('./pages/strength/strength.component').then(m => m.StrengthComponent) },
      { path: 'hacking-sim', loadComponent: () => import('./pages/hacking-sim/hacking-sim.component').then(m => m.HackingSimComponent) },
      { path: 'breach-check', loadComponent: () => import('./pages/breach-check/breach-check.component').then(m => m.BreachCheckComponent) },
      { path: 'passphrase', loadComponent: () => import('./pages/passphrase/passphrase.component').then(m => m.PassphraseComponent) },
      { path: 'history', loadComponent: () => import('./pages/history/history.component').then(m => m.HistoryComponent) },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) }
    ]
  },
  { path: '**', redirectTo: 'generator' }
];

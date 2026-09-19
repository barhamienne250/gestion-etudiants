import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'etudiants' },
  {
    path: 'connexion',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'inscription',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'etudiants',
    canActivate: [authGuard],
    loadComponent: () => import('./features/etudiants/etudiants-list/etudiants-list.component').then(m => m.EtudiantsListComponent),
  },
  {
    path: 'etudiants/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/etudiants/etudiant-form/etudiant-form.component').then(m => m.EtudiantFormComponent),
  },
  {
    path: 'enseignants',
    canActivate: [authGuard],
    loadComponent: () => import('./features/enseignants/enseignants-list/enseignants-list.component').then(m => m.EnseignantsListComponent),
  },
  {
    path: 'enseignants/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/enseignants/enseignant-form/enseignant-form.component').then(m => m.EnseignantFormComponent),
  },
  {
    path: 'cours',
    canActivate: [authGuard],
    loadComponent: () => import('./features/cours/cours-list/cours-list.component').then(m => m.CoursListComponent),
  },
  {
    path: 'cours/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/cours/cours-form/cours-form.component').then(m => m.CoursFormComponent),
  },
  {
    path: 'inscriptions',
    canActivate: [authGuard],
    loadComponent: () => import('./features/inscriptions/inscriptions-list/inscriptions-list.component').then(m => m.InscriptionsListComponent),
  },
  { path: '**', redirectTo: 'etudiants' },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'registro', 
    loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegistroComponent) 
  },
  { 
    path: 'seguimiento', 
    loadComponent: () => import('./pages/seguimiento/seguimiento.component').then(m => m.SeguimientoComponent) 
  },
  { 
    path: 'reportes', 
    loadComponent: () => import('./pages/reportes/reportes.component').then(m => m.ReportesComponent) 
  },
  { 
    path: 'usuarios', 
    loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent) 
  },
  { 
    path: 'unauthorized', 
    loadComponent: () => import('./pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) 
  }
];
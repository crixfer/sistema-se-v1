import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }

        if (!user.activo) {
          this.router.navigate(['/login']);
          return false;
        }

        // Verificar permisos específicos de la ruta si están definidos
        const requiredPermission = route.data?.['permission'];
        if (requiredPermission) {
          const [modulo, accion] = requiredPermission.split('.');
          if (!this.authService.tienePermiso(modulo, accion)) {
            this.router.navigate(['/unauthorized']);
            return false;
          }
        }

        return true;
      })
    );
  }
}
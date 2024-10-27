import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';

export const autenticarGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthenticationService);
  
  // Asegurarse de que el estado esté cargado de Storage antes de continuar
  await authService.init(); 
  
  return authService.isLoggedIn(); // Retorna el estado de autenticación
};

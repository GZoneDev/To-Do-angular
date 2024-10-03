import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userId = localStorage.getItem('UserId');
  const isExist = userId !== null;
  
  if (!isExist){
    router.navigate(['/auth']);
  }

  return isExist;
};

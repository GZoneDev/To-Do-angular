import { Routes } from '@angular/router';

import { authGuard } from './routing/guards/auth.guard';
import { AuthorizeComponent } from './components/authorize/authorize.component';
import { RegisterComponent } from './components/register/register.component';
import { ToDoComponent } from './components/to-do/to-do.component';

export const routes: Routes = [
  { path: 'auth', component: AuthorizeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'to-do', component: ToDoComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
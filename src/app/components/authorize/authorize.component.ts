import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl} from '@angular/forms';

import { UserService } from '../../services/user.service';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-authorize',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    UserService,
    ValidationService,
    Router],
  templateUrl: './authorize.component.html',
  styleUrl: './authorize.component.css'
})
export class AuthorizeComponent {
  public welcomeMessage: string = "Hello! let's get started";
  public singInMessage: string = "Sign in to continue.";
  public inviteToRegisterMessage: string = "Don't have an account?";
  public emailPlaceholderName: string = "Email";
  public passwordPlaceholderName: string = "Password";
  public loginButtonName: string = "SIGN IN";
  public linkRegisterComponentrName: string = "Create";
  
  protected loginForm: FormGroup;
  protected errorServerMessage: string | null = null;

  public constructor(
    private userService: UserService,
    private validationService: ValidationService,
    private router: Router){

    this.loginForm = new FormGroup({
      email: new FormControl('', this.validationService.getEmailValidators()),
      password: new FormControl('', this.validationService.getPasswordValidators())
    });
  }

  public login(): void{
    if (!this.loginForm.valid) {
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (email && password) {
      this.userService.loginUser(email, password)
        .subscribe({
          next: (response) => {
            console.log('Login success:', response);
            localStorage.setItem('UserId', response.message);
            this.router.navigate(['/to-do']);
            this.errorServerMessage = null;
          },
          error: (err) => {
            console.error('Login failed:', err);
            this.errorServerMessage = err.error;
          }
        });
    }
  }

  protected getPasswordErrorMessage(): string {
    const passwordControl = this.loginForm.get('password');

    if (passwordControl) {
      return this.validationService.getPasswordErrorMessage(passwordControl);
    }
    return '';
  }

  protected getEmailErrorMessage(): string {
    const emailControl = this.loginForm.get('email');

    if (emailControl) {
      return this.validationService.getEmailErrorMessage(emailControl);
    }
    return '';
  }
}

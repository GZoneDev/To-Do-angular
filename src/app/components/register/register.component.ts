import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';  

import { UserService } from '../../services/user.service';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  public welcomeQuestionMessage: string = "New here?";
  public welcomeMessage: string = "Signing up is easy. It only takes a few steps";
  public passwordNoMatchMessage: string = "Passwords do not match.";
  public registerButtomName: string = "SIGN UP";
  public accountExistenceMessage: string = "Already have an account?";
  public loginLinkName: string = "Login";

  protected registerForm: FormGroup;
  protected errorServerMessage: string | null = null;

  public constructor(
    private userService: UserService,
    private validationService: ValidationService,
    private router: Router) {
      
    this.registerForm = new FormGroup({
      username: new FormControl('', this.validationService.getRequiredLineValidators(2, 100)),
      email: new FormControl('', this.validationService.getEmailValidators()),
      password: new FormControl('', this.validationService.getPasswordValidators()),
      repeatPassword: new FormControl('', this.validationService.getRequiredLineValidators())      
    });
  }

  public register(): void {
    if (!(this.registerForm.valid && 
          this.matchPasswordValidator())) {
          return;
    }

    const username = this.registerForm.get('username')?.value;
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    
    if (email && password) {
      this.userService.registerUser(username, email, password)
        .subscribe({
          next: () => {
            console.log('Registration successful');
            this.router.navigate(['/auth']);
            this.errorServerMessage = null;
          },
          error: (err) => {
            console.error('Login failed:', err);
            this.errorServerMessage = err.error;
          }
        });
    }
  }

  protected matchPasswordValidator(): boolean {
    const password = this.registerForm.get('password')?.value;
    const repeatPassword = this.registerForm.get('repeatPassword')?.value;

    if (password !== repeatPassword) {
      this.registerForm.setErrors({ passwordsMismatch: true });
      return false;
    }
    return true;
  }

  protected getEmailErrorMessage(): string {
    const emailControl = this.registerForm.get('email');

    if (emailControl) {
      return this.validationService.getEmailErrorMessage(emailControl);
    }
    return '';
  }

  protected getPasswordErrorMessage(): string {
    const passwordControl = this.registerForm.get('password');

    if (passwordControl) {
      return this.validationService.getPasswordErrorMessage(passwordControl);
    }
    return '';
  }

  protected getRepeatPasswordErrorMessage(): string {
    const passwordControl = this.registerForm.get('repeatPassword');

    if (passwordControl) {
      return this.validationService.getPasswordErrorMessage(passwordControl);
    }
    return '';
  }

  protected getUsernameErrorMessage(): string {
    const usernameControl = this.registerForm.get('username');

    if (usernameControl) {
      return this.validationService.getCustomLineErrorMessage(usernameControl);
    }
    return '';
  }
}

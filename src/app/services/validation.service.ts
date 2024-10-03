import { Injectable } from '@angular/core';
import { Validators, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  
  public getPasswordValidators() {
    return [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/[A-Z]/),
      Validators.pattern(/[a-z]/),
      Validators.pattern(/[0-9]/),
      Validators.pattern(/[\W_]/)
    ];
  }

  public getEmailValidators() {
    return [
      Validators.required,
      Validators.email
    ];
  }

  public getRequiredLineValidators(minLength: number | undefined = undefined, maxLength: number | undefined = undefined) {
    const validators = [Validators.required];

    if (minLength) {
      validators.push(Validators.minLength(minLength));
    }
  
    if (maxLength) {
      validators.push(Validators.maxLength(maxLength));
    }
  
    return validators; 
  }

  public getPasswordErrorMessage(passwordControl: AbstractControl): string {
    if (passwordControl?.hasError('required')) {
      return 'Password is required.';
    }

    if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 6 characters long.';
    }

    if (passwordControl?.hasError('pattern')) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
    }

    return '';
  }

  public getEmailErrorMessage(emailControl: AbstractControl): string {
    if (emailControl?.hasError('required')) {
      return 'Email is required.';
    }

    if (emailControl?.hasError('email')) {
      return 'The email address must be in the correct format.';
    }

    return '';
  }

  public getCustomLineErrorMessage(lineControl: AbstractControl): string {
    if (lineControl?.hasError('required')) {
      return 'Line is required.';
    }
    
    if (lineControl?.hasError('minlength')) {
      const minLength = lineControl.getError('minlength').requiredLength;
    
      return `Line must be at least ${minLength} characters long.`;
    }
    
    if (lineControl?.hasError('maxlength')) {
      const maxLength = lineControl.getError('maxlength').requiredLength;
    
      return `Line must be no more than ${maxLength} characters.`;
    }
    return '';
  }
}
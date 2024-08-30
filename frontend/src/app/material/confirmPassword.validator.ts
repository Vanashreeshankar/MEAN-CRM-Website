

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const passwordControl = control.get('password');
  const confirmPasswordControl = control.get('C_password');

  if (!passwordControl || !confirmPasswordControl) {
    return null; // Return null if controls are not found (e.g., during initialization)
  }

  if (confirmPasswordControl.errors && !confirmPasswordControl.errors['confirmPasswordValidator']) {
    return null;
  }

  if (passwordControl.value !== confirmPasswordControl.value) {
    confirmPasswordControl.setErrors({ confirmPasswordValidator: true });
  } else {
    confirmPasswordControl.setErrors(null);
  }
  return null;
}
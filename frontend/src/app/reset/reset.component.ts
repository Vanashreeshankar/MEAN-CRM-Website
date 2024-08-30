import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from '../material/global-constants';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { SnackbarService } from '../service/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  resetForm: FormGroup = new FormGroup({
    email: new FormControl( '',[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]),
    pin: new FormControl('', [Validators.required, Validators.minLength(6)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(7)]),
    
  });
  responseMessage: any;
  hide = true;
 

  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: SnackbarService,
    private ngxService: NgxUiLoaderService,
   
  

  ){}
  ngOnInit() {
    
  }

  handleSubmit() {
    if (this.resetForm.invalid) {
      return;
    }

    const { email, pin, newPassword } = this.resetForm.value;

    this.userService.resetPassword(email, pin, newPassword).subscribe(
      (resp: any) => {
        console.log('server response:', resp);
        this.ngxService.stop();

        this.responseMessage = resp?.message;
        this.snackBar.openSnackBar(this.responseMessage, '');
       
          this.router.navigate(['/signin']);
        
        
      
      },
      (error) => {
        this.ngxService.stop();
       
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }
  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }
}
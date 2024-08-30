import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from '../material/global-constants';

import { UserService } from '../service/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../service/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent {
  EmailForm: FormGroup = new FormGroup({
    email: new FormControl( '', [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]),

    
  });

  responseMessage : any;

 
  constructor( 
    private userService: UserService,  
    private ngxService: NgxUiLoaderService, 
    private snackBar: SnackbarService,
    private dialogRef: MatDialogRef<ForgetpasswordComponent>,) { }


handleSubmit() {
  this.ngxService.start();
  this.userService.forgotPassword(JSON.stringify(this.EmailForm.value)).subscribe((res: any)=> {
    this.ngxService.stop();
    this.responseMessage = res?.message;
    this.dialogRef.close()
    this.snackBar.openSnackBar(this.responseMessage, '');
  }, (error)=> {
    this.ngxService.stop();
    if(error.error?.message){
      this.responseMessage = error.error?.message
    }else{
      this.responseMessage = GlobalConstants.genericError;
    }
    this.snackBar.openSnackBar(this.responseMessage,GlobalConstants.error)
  })
}
}

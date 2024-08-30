import { Component } from '@angular/core';
import { UserService } from '../service/user.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ForgetpasswordComponent } from '../forgetpassword/forgetpassword.component';
import { GlobalConstants } from '../material/global-constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../service/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  signinForm: FormGroup = new FormGroup({
    email: new FormControl( '',[Validators.required, Validators.pattern(GlobalConstants.emailRegex)]),
    password: new FormControl('', [Validators.required, Validators.minLength(7)]),
    
  });
  
  responseMessage: any;
  
  showError: boolean = false;
  message:string | undefined;
  hide = true;

  constructor(
    private router: Router,
    private userService: UserService,
    private snackBar: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
   
  ){}
  ngOnInit(): void {
    
  }

  forgotPasswordAction() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    this.dialog.open(ForgetpasswordComponent, dialogConfig);
  
  }
 

  handleSubmit() {
  
    this.ngxService.start();
  
    this.userService.signin(this.signinForm.value).subscribe(
      (resp: any) => {
        console.log('server response:', resp);
        this.ngxService.stop();

        this.responseMessage = resp?.message;
        this.snackBar.openSnackBar(this.responseMessage, '');
        if(resp && resp.accessJWT){
          localStorage.setItem('accessJWT', resp?.accessJWT);
          localStorage.setItem('refreshJWT', resp?.refreshJWT);
          localStorage.setItem('role', resp?.role);
          localStorage.setItem('username', resp?.username);
         
          this.router.navigate(['/dashboard']);
        }
        
      
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

import { Component } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from '../material/global-constants';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { SnackbarService } from '../service/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { confirmPasswordValidator } from '../material/confirmPassword.validator';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  responseMessage! : string ;
  hide = true;

  signupForm: FormGroup = new FormGroup({
    role: new FormControl('',[Validators.required]),
    key: new FormControl(''),
    email: new FormControl( '', [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]),
    username: new FormControl('',[Validators.required, Validators.pattern(GlobalConstants.nameRegex)]),
   
    password: new FormControl('', [Validators.required, Validators.minLength(7)]),
    C_password: new FormControl('',[Validators.required ])
    
  },{validators: confirmPasswordValidator});

  

  constructor(
   
    private router: Router,
    private userService: UserService,
    private snackbar : SnackbarService,
    private ngxService: NgxUiLoaderService
 
    
  ) {}
  
  ngOnInit(): void {
  
  }

  

  handleSubmit() {

    
    if (!this.signupForm.valid) {
      console.log('invalid')
      return
    }

    this.ngxService.start();

    const formdata = this.signupForm.value;

    if(formdata.role === 'admin'){
      formdata.key = '1998'

    }
    //console.log(this.signupForm.value)
    this.userService.signup(formdata).subscribe( (resp: any) => {
      console.log(resp);
      this.ngxService.stop();
      //check if resp.message exist and is a string
      if(typeof resp.message === 'string'){
        this.responseMessage = resp?.message ;
      }else{
        //if message is not a string use default message or handle it accordingly
        this.responseMessage = "Signup Successful"
      }
      
        this.snackbar.openSnackBar(this.responseMessage, '');
        this.signupForm.reset();
        this.router.navigate(['/']);
    }, (error) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbar.openSnackBar(this.responseMessage, GlobalConstants.error);
    }
    
    );

  }
   

  togglePasswordVisibility(): void {
      this.hide = !this.hide;
  }
      
    
  }



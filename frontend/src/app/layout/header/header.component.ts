import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {  Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { SnackbarService } from 'src/app/service/snackbar.service';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  usernameInitial! : string;


  constructor(private userService: UserService,private router: Router, private authService:AuthService){}
  
  ngOnInit(): void {
    const username = this.authService.getUsername();
    this.usernameInitial = username ? username.charAt(0).toUpperCase() : '';
  }

  logout(){
    this.userService.logout();
  
    this.router.navigate(['/signin'])
  }


  
}

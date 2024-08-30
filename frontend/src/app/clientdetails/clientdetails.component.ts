import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../service/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientdetails',
  templateUrl: './clientdetails.component.html',
  styleUrls: ['./clientdetails.component.css']
})
export class ClientdetailsComponent {

  inputdata: any;
  client: any;
  dialogRef: any;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  private userService: UserService){}
  
  ngOnInit(): void {
    this.inputdata = this.data;
    if (this.inputdata && this.inputdata._id) {
      this.getClientDetails(this.inputdata._id);
    } else {
      console.error('No valid _id provided');
    }
  }
  
  getClientDetails(_id: any) {
    this.userService.getClientById(_id).subscribe((client: any) => {
      this.client = client;
      console.log('Client Details:', this.client); // Log client data to ensure it's received
    });
  }
    
   
  }

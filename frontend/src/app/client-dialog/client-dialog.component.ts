import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from '../model/client.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-client-dialog',
  templateUrl: './client-dialog.component.html',
  styleUrls: ['./client-dialog.component.css']
})
export class ClientDialogComponent implements OnInit {
  inputdata: any;

  AddForm: FormGroup = new FormGroup({
    organization_name: new FormControl('', Validators.required),
    first_name: new FormControl('', Validators.required),
    middle_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    email_address: new FormControl('', Validators.required),
    phone_number: new FormControl('', Validators.required),
    street: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zip: new FormControl('', Validators.required),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogref: MatDialogRef<ClientDialogComponent>,
              private userService: UserService) {}

  ngOnInit(): void {
    console.log('Dialog data:', this.data);  // Add this line for debugging
    this.inputdata = this.data;
    if (this.inputdata.client) {
      this.AddForm.patchValue(this.inputdata.client);
      console.log('Form values:', this.AddForm.value);  // Add this line for debugging

    }
  }

  closepopup() {
    this.dialogref.close('closed using function');
  }

  Saveclient() {
    if (this.AddForm.valid) {
      if (this.inputdata.client) {
        // Editing existing client
        const updatedClient = { ...this.inputdata.client, ...this.AddForm.value };
        this.userService.editbyId(updatedClient).subscribe(
          (res: any) => {
            console.log(res);
            this.dialogref.close(this.AddForm.value); // Return form data to the profile component
          },
          (error: any) => {
            console.error('Error saving client data', error);
          }
        );
      } else {
        // Adding new client
        this.userService.saveClients(this.AddForm.value).subscribe(
          (res: any) => {
            console.log(res);
            this.dialogref.close(this.AddForm.value); // Return form data to the profile component
          },
          (error: any) => {
            console.error('Error saving client data', error);
          }
        );
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
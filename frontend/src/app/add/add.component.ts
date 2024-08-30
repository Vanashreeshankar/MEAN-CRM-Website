import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from '../model/client.model';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  inputdata: any;
  actionBtn: string = "Save";

  AddForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Client, 
  private dialogref: MatDialogRef<AddComponent>,
    private userService: UserService) {
      
    this.AddForm = this.createFormGroup(); // Initialize the form group
  }

  ngOnInit(): void {
    this.inputdata = this.data;
    if (this.inputdata && this.inputdata.data) {
      this.actionBtn = "Update";
      this.setpopupdata(this.inputdata.data);
    }
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
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
  }

  setpopupdata(data: any) {
    // Fetch client data for editing
    this.userService.editbyId(data).subscribe(
      (res: any) => {
        console.log('editform:', res);
        // Populate the form fields with the retrieved client data
        this.AddForm.patchValue({
          organization_name: res.organization_name,
          first_name: res.first_name,
          middle_name: res.middle_name,
          last_name: res.last_name,
          email_address: res.email_address,
          phone_number: res.phone_number,
          street: res.street,
          city: res.city,
          state: res.state,
          zip: res.zip,
        });
      },
      error => {
        console.error('edit error:', error);
      }
    );
  }

  closepopup() {
    this.dialogref.close('closed using function');
  }

  Saveclient() {
  if (this.actionBtn === "Update") {
      // Logic for updating existing client
      // Construct the data object to be updated
      const updatedData = {
        _id: this.inputdata.data._id, // Assuming _id is required for updating
        ...this.AddForm.value // Include updated client information
      };
     
      // Call the service method to update the client
      this.userService.editbyId(updatedData).subscribe(
        (res: any) => {
          console.log(res);
          this.closepopup();
        },
        error => {
          console.error('update error:', error);
        }
      );
    }
  }
}
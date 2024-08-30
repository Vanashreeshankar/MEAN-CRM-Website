import { Component,Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketService } from '../service/ticket.service';
import { Ticket } from '../model/ticket.model';

@Component({
  selector: 'app-ticket-dialog',
  templateUrl: './ticket-dialog.component.html',
  styleUrls: ['./ticket-dialog.component.css']
})
export class TicketDialogComponent {

  AddForm: FormGroup = new FormGroup({
    sender: new FormControl('', Validators.required),
    subject: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
  });
  
  inputdata: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Ticket, private dialogref: MatDialogRef<TicketDialogComponent>,
  private ticketService: TicketService) {}

  ngOnInit(): void {
    this.inputdata = this.data;
    
  }

  closepopup() {
    this.dialogref.close('closed using function');
  }

  SaveTicket() {
    if (this.AddForm.valid) {
      this.ticketService.saveTicket(this.AddForm.value).subscribe(
        (res: any) => {
          console.log(res);
          this.dialogref.close(this.AddForm.value); // Return form data to the profile component
        },
        (error: any) => {
          console.error('Error saving data', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

}

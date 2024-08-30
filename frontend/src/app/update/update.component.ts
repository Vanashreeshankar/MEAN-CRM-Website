import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TicketService } from '../service/ticket.service';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../service/auth.service';
import { SnackbarService } from '../service/snackbar.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})

export class UpdateComponent implements OnChanges {
  @Input() ticketId: any | null = null;
  @Output() closeUpdate = new EventEmitter<void>();

  ticket: any;
  responseMessage: any;
  message:string | undefined;
  updateForm: FormGroup;
  isAdmin: boolean = false;
  statusMessage!: string;
  currentUser: string | null;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private snackbar : SnackbarService
  ) {
    this.updateForm = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });

    this.currentUser = this.authService.getUsername();

    // Check if the user is an admin
    const tokenPayload = this.authService.getTokenPayload();
    console.log("Token Payload:", tokenPayload); // Debug log

    if (tokenPayload) {
      this.isAdmin = tokenPayload.role === 'admin';
      console.log("User is admin:", this.isAdmin); // Debug log
    } else {
      console.log("Token payload is null"); // Debug log
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ticketId'] && changes['ticketId'].currentValue) {
      this.loadTicketDetails(changes['ticketId'].currentValue);
    }
  }

  onCancel(): void {
    this.updateForm.reset();
    this.statusMessage = 'Update cancelled.';
    this.snackbar.openSnackBar('Update cancelled.', '');
    this.closeUpdate.emit(); // Emit the event
  }

  loadTicketDetails(ticketId: string): void {
    this.ticketService.getTicketById(ticketId).subscribe(
      (ticket: any) => {
        this.ticket = ticket;
        console.log('ticket', ticket)
      },
      error => {
        console.error('Error fetching ticket details', error);
      }
    );
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      const message = this.updateForm.get('message')?.value;
      const sender = this.authService.getTokenPayload()?.username;
      console.log("Sender:", sender); // Debug log
  
      this.ticketService.updateTicketMessage(this.ticketId, message, sender).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.statusMessage = 'Message updated successfully!';
            this.snackbar.openSnackBar('Message updated successfully!', '');
            // Optionally refresh the ticket details
            this.loadTicketDetails(this.ticketId!);
  
            // Clear the textarea after message update
            this.updateForm.reset();  // Resets the form
  
  
          } else {
            this.statusMessage = 'Failed to update the message.';
            this.snackbar.openSnackBar('Failed to update the message.', '');
          }
        },
        error => {
          console.error('Error updating message', error);
          this.statusMessage = 'An error occurred while updating the message.';
          this.snackbar.openSnackBar('An error occurred while updating the message.', '');
        }
      );
    }
  }
  
  onCloseTicket(): void {
    if (this.ticketId) {
      this.ticketService.closeTicket(this.ticketId).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.statusMessage = 'Ticket closed successfully!';
            this.snackbar.openSnackBar('Ticket closed successfully!', '');
            // Optionally refresh the ticket details or navigate away
            this.loadTicketDetails(this.ticketId);
          } else {
            this.statusMessage = 'Failed to close the ticket.';
          }
        },
        error => {
          console.error('Error closing ticket', error);
          this.statusMessage = 'An error occurred while closing the ticket.';
          this.snackbar.openSnackBar('An error occurred while closing the message.', '');
        }
      );
    }
  }

 

  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: 'numeric', minute: 'numeric', hour12: true 
    };
    return new Date(date).toLocaleDateString('en-US', options);
  }

  isSender(sender: string): boolean {
    return sender === this.currentUser;
  }
}

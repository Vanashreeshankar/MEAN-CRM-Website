import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketService } from '../service/ticket.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-ticketdetails',
  templateUrl: './ticketdetails.component.html',
  styleUrls: ['./ticketdetails.component.css']
})

export class TicketdetailsComponent implements OnInit {
  inputdata: any;
  ticket: any;
  currentUser: string | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matref: MatDialogRef<TicketdetailsComponent>,
    private ticketService: TicketService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getUsername();
  }

  ngOnInit(): void {
    this.inputdata = this.data;
    console.log('Initialized', this.inputdata);
    if (this.inputdata && this.inputdata._id) {
      this.getTicketDetails(this.inputdata._id);
    } else {
      console.error('No valid _id provided');
    }
  }

  getTicketDetails(_id: any) {
    this.ticketService.getTicketById(_id).subscribe((ticket: any) => {
      this.ticket = ticket;
      console.log('Ticket Details:', this.ticket);
    },
    (error) => {
      console.error('Error fetching', error);
    });
  }

  closeTicket(_id: any) {
    this.ticketService.closeTicket(_id).subscribe(
      response => {
        console.log('Ticket closed successfully:', response);
      },
      error => {
        console.error('Error closing ticket:', error);
      }
    );
  }

  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(date).toLocaleString(undefined, options);
  }

  isSender(sender: string): boolean {
    return sender === this.currentUser;
  }
}

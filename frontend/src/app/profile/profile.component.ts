import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ClientDialogComponent } from '../client-dialog/client-dialog.component';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';

import { AuthService } from '../service/auth.service';
import { TicketService } from '../service/ticket.service';
import { SnackbarService } from '../service/snackbar.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  showUpdate: boolean = false;
  selectedTicketId: string | null = null;
  client: any = null; // Single client object
  tickets: any[] = [];
  deleteMode: boolean = false;
  isSmallScreen: boolean = false;

  constructor(
   
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private ticketService: TicketService,
    private snackbar: SnackbarService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });

    this.authService.checkAndRefreshToken().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.fetchProfile();
      } else {
        this.router.navigate(['/signin']);
      }
    });
  }

  fetchProfile(): void {
    this.userService.getProfile().subscribe(
      data => {
        if (data.status === 'success') {
          // Ensure client and tickets are correctly assigned
          this.client = data.client || null;
          this.tickets = data.tickets || [];

          // Debug information to verify assignment
          console.log('Client:', this.client);
          console.log('Tickets:', this.tickets);
        } else {
          console.error('Profile fetch was not successful');
        }
      },
      error => {
        console.error('Error fetching profile', error);
      }
    );
  }

  addClient() {
    this.openDialog(0, 'Add Client', ClientDialogComponent, 'client');
  }

  editClient(_id: any) {
    this.openDialog(_id, 'Edit Client', ClientDialogComponent, 'client');
  }

  addTicket() {
    this.openDialog(0, 'Add Ticket', TicketDialogComponent, 'ticket');
  }

  openDialog(client: any, title: any, component: any, type: string) {
    const dialogRef = this.dialog.open(component, {
      data: { title: title, client: client }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === 'client') {
          this.addClientDetails(result);
          this.fetchProfile();
        } else if (type === 'ticket') {
          this.addTicketDetails(result);
          this.fetchProfile();
        }
      }
    });
  }

  addClientDetails(clientDetails: any) {
    this.client = clientDetails;
  }

  addTicketDetails(ticketDetails: any) {
    this.tickets.push(ticketDetails);
  }

  toggleUpdate() {
    this.showUpdate = !this.showUpdate;
  }

  handleCloseUpdate(): void {
    this.showUpdate = false;
    this.selectedTicketId = null;
  }

  onClick(ticketId: string): void {
    if (this.selectedTicketId === ticketId && this.showUpdate) {
      this.showUpdate = false;
      this.selectedTicketId = null;
    } else {
      this.selectedTicketId = ticketId;
      this.showUpdate = true;
    }
  }

  toggleDeleteMode() {
    if (this.deleteMode && this.selectedTicketsCount === 0) {
      this.deleteMode = false;
    } else {
      this.deleteMode = !this.deleteMode;
    }
  }

  onDeleteIconClick(ticketId: string) {
    this.toggleDeleteMode();
    this.selectedTicketId = ticketId;
  }

  deleteSelectedTickets() {
    const selectedTicketIds = this.tickets
      .filter(ticket => ticket.selected)
      .map(ticket => ticket._id);

    if (selectedTicketIds.length > 0) {
      this.ticketService.deleteTicketsMore(selectedTicketIds).subscribe(() => {
        this.snackbar.openSnackBar('Tickets Deleted!!', '');
        this.fetchProfile(); // Refresh the ticket list
        this.deleteMode = false; // Exit delete mode after deletion
      });
    } else {
      alert('No tickets selected');
      this.toggleDeleteMode(); // Close delete mode if no tickets are selected
      this.snackbar.openSnackBar('Please select the Ticket', '');
    }
  }

  get selectedTicketsCount(): number {
    return this.tickets.filter(ticket => ticket.selected).length;
  }
}


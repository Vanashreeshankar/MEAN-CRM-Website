import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../service/ticket.service';
import { UserService } from '../service/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ticket } from '../model/ticket.model';
import { SnackbarService } from '../service/snackbar.service';
import { GlobalConstants } from '../material/global-constants';
import { jwtDecode } from 'jwt-decode';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Tile } from '../model/tiles';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {
  clientCount: number = 0;
  ticket: number = 0;
  presentTicket: number = 0;
  closedTicket: number = 0;
  cols: number = 4;
  messages: { sender: any, message: any, msgAt: string }[] = [];
  isAdmin: boolean = false;
  isSmallScreen: boolean = false;
  isMessagesVisible: boolean = false;
 
  filterValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  displayedColumns: string[] = ['_id', 'conversations', 'subject', 'openAt', 'status'];
  dataSource = new MatTableDataSource<Ticket>();
  tiles: Tile[] = [];

  private subscriptions: Subscription = new Subscription();

  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private router: Router,
    private snackbar: SnackbarService,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web])
        .subscribe(result => {
          if (result.matches) {
            this.adjustGridCols();
            this.checkScreenSize();
          }
        })
    );

    this.subscriptions.add(
      this.authService.checkAndRefreshToken().subscribe(isAuthenticated => {
        if (isAuthenticated) {
          const role = this.authService.getUserRole();
          this.isAdmin = role === 'admin';
          this.loadDashboardData();
        } else {
          this.router.navigate(['/signin']);
        }
      })
    );

    this.loadMessageVisibility();

    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private adjustGridCols() {
    this.cols = this.breakpointObserver.isMatched(Breakpoints.Handset) ? 1 :
                this.breakpointObserver.isMatched(Breakpoints.Tablet) ? 2 : 4;
  }

  private checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 768;
  }

  private loadMessageVisibility() {
    this.subscriptions.add(
      this.authService.messageVisibility$.subscribe(isVisible => {
        this.isMessagesVisible = isVisible;
      })
    );
  }

  
private createFilter(): (data: Ticket, filter: string) => boolean {
  return (data: Ticket, filter: string): boolean => {
    const searchTerms = filter.toLowerCase();
    const openAtFormatted = new Date(data.openAt).toLocaleDateString('en-GB');
    return data._id.toLowerCase().includes(searchTerms) ||
           data.subject.toLowerCase().includes(searchTerms) ||
           data.status.toLowerCase().includes(searchTerms) ||
           openAtFormatted.includes(searchTerms) ||  
           data.conversations.some(convo => convo.sender.toLowerCase().includes(searchTerms));
  };
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadDashboardData() {
    this.ticketService.getDetails().subscribe(
      (data) => {
        this.clientCount = data.clientCount;
        this.ticket = data.ticket;
        this.presentTicket = data.presentTicket;
        this.closedTicket = data.closedTicket;
        this.tiles = [
          { label: 'Clients Count', count: this.clientCount },
          { label: 'Ticket', count: this.ticket },
          { label: 'Present', count: this.presentTicket },
          { label: 'Closed', count: this.closedTicket }
        ];
      },
      (error) => {
        console.error('Error loading dashboard data:', error);
      }
    );

    this.ticketService.getAllTicket().subscribe(res => {
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      const loggedInUsername = this.authService.getUsername();

      if (this.isAdmin) {
      
          // Admin sees all messages except those sent by admins
          this.messages = res.flatMap((ticket: Ticket) =>
            ticket.conversations
              .filter(convo => convo.sender !== loggedInUsername) // Filter out messages sent by the admin
              .map(convo => ({
                sender: convo.sender,
                message: convo.message,
                msgAt: convo.msgAt
              }))
          );
        
       
      }
    });
  }

  getConversationWithIndex(conversations: any[]): { index: number, conversation: any }[] {
    return conversations.map((conversation, index) => ({ index, conversation }));
  }
}
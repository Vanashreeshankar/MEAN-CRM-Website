import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../service/user.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  selectedRowId: any;
  userData: any = {};
  combinedData: any;
  client: any;
  task: any;
  showUpdate: boolean = false;
  selectedTicketId: string | null = null;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const clientId = params['clientId'];
      this.userService.getBothClientTaskDetails(clientId).subscribe((user: any) => {
        this.client = user;
        console.log(this.client);
      });
    });
  }

  toggleUpdate(ticketId?: string): void {
    this.showUpdate = !this.showUpdate;
    if (ticketId) {
      this.selectedTicketId = ticketId;
    }
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

}
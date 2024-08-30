import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ticket } from '../model/ticket.model';
import { TicketService } from '../service/ticket.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TicketdetailsComponent } from '../ticketdetails/ticketdetails.component';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  showButtons: boolean = false;
  filterValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  
  displayedColumns: string[]  = ['_id', 'conversations', 'subject','openAt', 'status'];
  dataSource = new MatTableDataSource<Ticket>()

  constructor(
    private ticketService: TicketService, private dialog: MatDialog,
  
    private router: Router){}

  ngOnInit(): void {

  this.TicketList();
  this.dataSource.filterPredicate = this.createFilter();

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

TicketList(){
  this.ticketService.getAllTicket().subscribe(res => {
    console.log(res);
    this.dataSource.data = res;
     this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  })
}

getConversationWithIndex(conversations: any[]): { index: number, conversation: any }[] {
  return conversations.map((conversation, index) => ({ index, conversation }));
}

onRowClick(clientId: any){
  this.router.navigate(['details/:clientId'], {queryParams: {clientId}})
}


detailsOfTicket(_id: any){
  console.log('Ticket Id:', _id)

this.openDialog(_id, 'Details Ticket', TicketdetailsComponent)
}

openDialog(_id: any, title: any, component: any) {
  const dialogRef = this.dialog.open(component, {
    data: {
      title: title,
      //data: _id,
      _id: _id //ensure _id is passed in data object
    }
  })
  dialogRef.afterClosed().subscribe(result => {
    
    console.log(result);
   
    this.TicketList()

  });
}


deleteTicket(_id: any) {

  console.log('Ticket ID:', _id)

  this.ticketService.deleteTicket(_id).subscribe(res => {
    console.log('Ticket deleted successfully:', res);
    alert('Deleted Successfully')
    this.TicketList()

  },
  error => {
    console.error('Error delete ticket:', error);
    // Handle error, show error message
  })

}

closeTicket(_id: any) {
  this.ticketService.closeTicket(_id).subscribe(
    response => {
      console.log('Ticket closed successfully:', response);
      // Handle success, maybe update UI or show a message
    },
    error => {
      console.error('Error closing ticket:', error);
      // Handle error, show error message
    }
  );
}

toggleButtons(clickedClient: any): void{
  this.dataSource.data.forEach(client => {
    if(client === clickedClient){
      client.showButtons = !client.showButtons
  console.log(client.showButtons)
    }else{
      client.showButtons = false
    }
  })
 
}



}

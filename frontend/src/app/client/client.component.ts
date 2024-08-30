import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { AddComponent } from '../add/add.component';
import { Client } from '../model/client.model';
import { ClientdetailsComponent } from '../clientdetails/clientdetails.component';
import { SnackbarService } from '../service/snackbar.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  clients!: Client[];
  responseMessage: any;
  message: string | undefined;
  displayedColumns: string[] = ['organization_name', 'first_name', 'email_address', 'phone_number', 'city', 'state'];
  dataSource = new MatTableDataSource<Client>();
  showButtons: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router,
    private snackbar: SnackbarService,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.ClientList();
    /*this.breakpointObserver.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape,
      Breakpoints.TabletPortrait,
      Breakpoints.TabletLandscape,
      Breakpoints.WebPortrait,
      Breakpoints.WebLandscape
    ]).subscribe(result => {
      if (result.matches) {
        console.log('Screen size changed:', result);
        this.applyResponsiveStyles(result);
      }
    });*/
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ClientList() {
    this.userService.getAllClients().subscribe(res => {
      console.log(res);
      this.dataSource.data = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  editClient(_id: any) {
    this.openDialog(_id, 'Edit Client', AddComponent);
  }

  detailsOfClient(_id: any) {
    console.log('client Id:', _id);
    this.openDialog(_id, 'Details Client', ClientdetailsComponent);
  }

  openDialog(_id: any, title: any, component: any) {
    const dialogRef = this.dialog.open(component, {
      data: {
        title: title,
        data: _id,
        _id: _id
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.ClientList();
    });
  }

  deleteClients(_id: any) {
    console.log(_id);
    this.userService.deleteClient(_id).subscribe(res => {
      console.log(res);
      this.responseMessage = res?.message;
      this.snackbar.openSnackBar(this.responseMessage, '');
      this.ClientList();
    });
  }

  onRowClick(clientId: any) {
    console.log('clicked:', clientId);
    this.router.navigate(['details/:clientId'], { queryParams: { clientId } });
  }

  toggleButtons(clickedClient: any): void {
    this.dataSource.data.forEach(client => {
      if (client === clickedClient) {
        client.showButtons = !client.showButtons;
        console.log(client.showButtons);
      } else {
        client.showButtons = false;
      }
    });
  }

  /*applyResponsiveStyles(result: any) {
    if (result.breakpoints[Breakpoints.HandsetPortrait] || result.breakpoints[Breakpoints.HandsetLandscape]) {
      // Apply styles for small screens
    } else if (result.breakpoints[Breakpoints.TabletPortrait] || result.breakpoints[Breakpoints.TabletLandscape]) {
      // Apply styles for medium screens
    } else if (result.breakpoints[Breakpoints.WebPortrait] || result.breakpoints[Breakpoints.WebLandscape]) {
      // Apply styles for large screens
    }
  }*/
}


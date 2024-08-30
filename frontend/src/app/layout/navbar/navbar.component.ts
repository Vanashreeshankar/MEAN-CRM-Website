import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  role: string | null = '';
  isSmallScreen: boolean = false;
  @Output() toggleMessageVisibility = new EventEmitter<boolean>();

  isMessagesVisible: boolean = false;


  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.role = this.authService.getUserRole();
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 768;
  }
  toggleMessages() {
   // this.isMessagesVisible = !this.isMessagesVisible;
    this.authService.toggleMessageVisibility();
  }
}
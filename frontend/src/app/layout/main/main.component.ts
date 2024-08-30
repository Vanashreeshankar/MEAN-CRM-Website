import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  isSmallScreen: boolean = false;
  isMessagesVisible: boolean = false;

  handleToggleMessageVisibility(event: boolean) {
    this.isMessagesVisible = event;
  }
}
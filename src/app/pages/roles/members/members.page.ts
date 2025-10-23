import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // For all ion-* elements
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
  imports: [
    IonicModule, // <-- Add this
    CommonModule // <-- Add this if you have *ngIf, *ngFor, or async pipe
  ]
})
export class MembersPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

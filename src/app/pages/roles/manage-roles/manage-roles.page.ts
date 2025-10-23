import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // For all ion-* elements
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-roles',
  templateUrl: './manage-roles.page.html',
  styleUrls: ['./manage-roles.page.scss'],
  imports: [
    IonicModule, // <-- Add this
    CommonModule // <-- Add this if you have *ngIf, *ngFor, or async pipe
  ]
})
export class ManageRolesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

// src/app/pages/roles/roles.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- Import ReactiveFormsModule here!

import { IonicModule } from '@ionic/angular'; // <-- Import IonicModule here!

import { RolesPageRoutingModule } from './roles-routing.module'; // Assuming you have this

import { RolesPage } from './roles.page'; // <-- Import the RolesPage component itself

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // <--- Add ReactiveFormsModule here to support [formGroup]
    IonicModule,         // <--- Add IonicModule here to support all ion-* elements
    RolesPageRoutingModule // Make sure this is correctly imported
  ],
  declarations: [RolesPage] // <--- IMPORTANT: You MUST declare RolesPage here
})
export class RolesPageModule {}
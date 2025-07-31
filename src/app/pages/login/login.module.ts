// src/app/pages/login/login.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- Add ReactiveFormsModule here
                                                                 // (LoginPage uses FormBuilder/FormGroup)

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page'; // <-- Import LoginPage itself

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // <-- Add ReactiveFormsModule
    IonicModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage] // <-- IMPORTANT: You MUST declare LoginPage here
})
export class LoginPageModule {}
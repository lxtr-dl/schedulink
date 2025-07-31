import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// IMPORTANT: Add these imports here for global availability:
import { HttpClientModule } from '@angular/common/http'; // For making HTTP requests in services
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // For all forms throughout your app

@NgModule({
  declarations: [
    AppComponent // AppComponent MUST be declared here
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(), // Essential for all Ionic components to work
    AppRoutingModule,
    HttpClientModule, // <--- ADD THIS
    ReactiveFormsModule, // <--- ADD THIS
    FormsModule // <--- ADD THIS (if you use ngModel anywhere)
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent], // AppComponent is bootstrapped here by main.ts via this module
})
export class AppModule {}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ 1. IMPORT FormsModule
import { IonicModule } from '@ionic/angular'; // ✅ 2. IMPORT IonicModule
import { MusicPageRoutingModule } from './music-routing.module';
import { MusicPage } from './music.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // ✅ 2. ADD TO IMPORTS
    IonicModule,
    MusicPageRoutingModule
  ],
})
export class MusicPageModule {}
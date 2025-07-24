import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // ✅ 1. Import IonicModule
import { CommonModule } from '@angular/common'; // ✅ 2. Import CommonModule

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true, // ✅ 3. Add this line
  imports: [IonicModule, CommonModule], // ✅ 4. Add this imports array
})
export class TabsPage {
  constructor() {}
}
// src/app/pages/roles/roles.page.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // For all ion-* elements
import { RouterModule } from '@angular/router'; // For <router-outlet>

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonicModule, 
    RouterModule
  ]
})
export class RolesPage implements OnInit {
  segment = 'roles'; // default

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // if user navigated directly to a child path, set the segment accordingly
    const path = this.route.snapshot.routeConfig?.path || '';
    // nothing special — we rely on router navigation below
  }

  async segmentChanged(ev: CustomEvent) {
    const val = ev.detail.value;
    this.segment = val;

    if (val === 'roles') {
      // navigate to base path /tabs/roles (keeps roles content visible)
      await this.router.navigate(['/tabs/roles']);
    } else if (val === 'manage-roles') {
      await this.router.navigate(['/tabs/roles/manage-roles']);
    } else if (val === 'members') {
      await this.router.navigate(['/tabs/roles/members']);
    }
  }
}

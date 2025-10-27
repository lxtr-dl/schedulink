// src/app/pages/roles/roles.page.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'; // Import NavigationEnd
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { filter } from 'rxjs/operators'; // Import filter operator
import { Subscription } from 'rxjs'; // Import Subscription

@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  styleUrls: ['./roles.page.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule, RouterModule ]
})
export class RolesPage implements OnInit, OnDestroy { // Add OnDestroy
  segment = 'roles'; 
  private routerSubscription: Subscription | null = null; // For cleanup

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // ✅ FIX: Listen to router events to set the active segment
    this.routerSubscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Get the last part of the URL
      const urlSegments = event.urlAfterRedirects.split('/');
      const lastSegment = urlSegments[urlSegments.length - 1];
      
      // Check if the last segment matches known values, otherwise default to 'roles'
      if (['manage-roles', 'members'].includes(lastSegment)) {
        this.segment = lastSegment;
      } else {
        this.segment = 'roles'; // Default if on /tabs/roles
      }
    });
  }

  ngOnDestroy() { // Add this for cleanup
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // ✅ FIX: Simplify segmentChanged - only update the segment property
  segmentChanged(ev: CustomEvent) {
    this.segment = ev.detail.value;
    // REMOVED the router.navigate calls
  }
}
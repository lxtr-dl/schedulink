// src/app/pages/roles/roles-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesPage } from './roles.page';
import { AdminGuard } from 'src/app/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: RolesPage,
    // Define child routes WITHIN the parent RolesPage route
    children: [ 
      {
        path: 'manage-roles', // Path is now relative to '/tabs/roles'
        // ✅ FIX: Use canActivate array for standalone components
        canActivate: [AdminGuard], 
        loadChildren: () => import('./manage-roles/manage-roles.module').then( m => m.ManageRolesPageModule)
      },
      {
        path: 'members', // Path is now relative to '/tabs/roles'
        // ✅ FIX: Use canActivate array for standalone components
        canActivate: [AdminGuard], 
        loadChildren: () => import('./members/members.module').then( m => m.MembersPageModule)
      },
      // Optional: Add a default child route if needed when only '/tabs/roles' is visited
      // {
      //   path: '', // Default child when path is exactly '/tabs/roles'
      //   redirectTo: 'some-default-child', // Or load a default component
      //   pathMatch: 'full'
      // }
    ]
  }
  // REMOVED the separate paths for manage-roles and members, they are now children
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesPageRoutingModule {}
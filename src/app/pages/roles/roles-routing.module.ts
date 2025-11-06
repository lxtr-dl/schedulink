import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesPage } from './roles.page';
import { AdminGuard } from 'src/app/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: RolesPage,
    // ✅ 1. ADD THE 'children' ARRAY
    // This tells Angular to load these pages inside the
    // <router-outlet> of RolesPage.
    children: [
      {
        path: 'manage-roles', // Path is now '/tabs/roles/manage-roles'
        canActivate: [AdminGuard], // Use the guard we made
        loadChildren: () => import('./manage-roles/manage-roles.module').then( m => m.ManageRolesPageModule)
      },
      {
        path: 'members', // Path is now '/tabs/roles/members'
        canActivate: [AdminGuard], // Use the guard we made
        loadChildren: () => import('./members/members.module').then( m => m.MembersPageModule)
      }
      // ✅ 2. (OPTIONAL) Add a default child route
      // This will make the "ROLES" content (from roles.page.html)
      // load by default.
      // {
      //   path: '',
      //   redirectTo: 'roles-content', // This needs a component
      //   pathMatch: 'full'
      // }
    ]
  }
  // ⛔ 3. REMOVE the old, separate routes.
  // {
  //   path: 'manage-roles',
  //   loadChildren: () => ...
  // },
  // {
  //   path: 'members',
  //   loadChildren: () => ...
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesPageRoutingModule {}
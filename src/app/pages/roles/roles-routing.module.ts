import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolesPage } from './roles.page';

const routes: Routes = [
  {
    path: '',
    component: RolesPage
  },  {
    path: 'manage-roles',
    loadChildren: () => import('./manage-roles/manage-roles.module').then( m => m.ManageRolesPageModule)
  },
  {
    path: 'members',
    loadChildren: () => import('./members/members.module').then( m => m.MembersPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesPageRoutingModule {}

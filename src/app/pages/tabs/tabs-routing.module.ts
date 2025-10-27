// src/app/pages/tabs/tabs-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';
// import { AuthGuard } from 'src/app/guards/auth.guard'; // 1. REMOVE AuthGuard import

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    // canActivate: [AuthGuard], // 2. REMOVE this line
    children: [
      { path: 'home', loadChildren: () => import('../home/home.module').then(m => m.HomePageModule) },
      { path: 'schedule', loadChildren: () => import('../schedule/schedule.module').then(m => m.SchedulePageModule) },
      { path: 'roles', loadChildren: () => import('../roles/roles.module').then(m => m.RolesPageModule) },
      // Add music/announcements paths here too
      { path: '', redirectTo: '/tabs/home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
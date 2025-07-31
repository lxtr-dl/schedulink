import { NgModule } from '@angular/core'; // Keep NgModule
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// No need to import LoginPage or RolesPage directly here if they are lazy-loaded via their modules.
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    // CHANGE THIS: Use loadChildren for non-standalone pages that are part of a module.
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'roles',
    // This already uses loadChildren, which is correct for a non-standalone RolesPage.
    loadChildren: () => import('./pages/roles/roles.module').then(m => m.RolesPageModule)
    // You might want to add canActivate: [AuthGuard] here too, so only logged-in users can access roles.
  },
];

// ENSURE THIS @NgModule BLOCK IS UNCOMMENTED AND ACTIVE:
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
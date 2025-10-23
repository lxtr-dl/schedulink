import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageRolesPageRoutingModule } from './manage-roles-routing.module';

import { ManageRolesPage } from './manage-roles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageRolesPageRoutingModule
  ],
})
export class ManageRolesPageModule {}

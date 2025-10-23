import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageRolesPage } from './manage-roles.page';

describe('ManageRolesPage', () => {
  let component: ManageRolesPage;
  let fixture: ComponentFixture<ManageRolesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRolesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

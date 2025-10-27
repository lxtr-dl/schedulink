import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create spies for the services
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      // Mock the new isAuthenticated$ observable
      isAuthenticated$: of(true) 
    });
    
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if user is authenticated', (done) => {
    // Set the observable to return true (authenticated)
    (Object.getOwnPropertyDescriptor(authServiceSpy, 'isAuthenticated$')?.get as any)
      .and.returnValue(of(true));

    guard.canActivate().subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should redirect to /login if user is not authenticated', (done) => {
    // Set the observable to return false (not authenticated)
    (Object.getOwnPropertyDescriptor(authServiceSpy, 'isAuthenticated$')?.get as any)
      .and.returnValue(of(false));

    // Mock the UrlTree
    const urlTree = new UrlTree();
    routerSpy.createUrlTree.and.returnValue(urlTree);

    guard.canActivate().subscribe(result => {
      expect(result).toBe(urlTree);
      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { Logout } from '../../auth.actions';
import { Observable } from 'rxjs';
import { isLoggedIn, isLoggedOut } from '../../auth.selectors';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { AppUser } from 'src/app/shared/models/app-user';
import { selectCartItemQuantity } from 'src/app/shared/store/shopping-cart.selectors';
import { AllProductsRequested } from 'src/app/shared/store/product.actions';
import { AllCartItemsRequested, CartQuantityRequested, EmptyCartRequested } from 'src/app/shared/store/shopping-cart.actions';
import { AllCategoriesRequested } from 'src/app/shared/store/category.actions';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.scss']
})
export class BsNavbarComponent implements OnInit {

  isNavbarCollapsed = true;

  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  cartItemQuantity$: Observable<number>;

  constructor(
    public auth: AuthService,
    private store: Store<AppState>,
    private router: Router,
    public userService: UserService) { }

  ngOnInit() {
    // These select functions ensure observable only emits on actual changes to auth (vs other state changes)
    this.isLoggedIn$ = this.store
    .pipe(
      select(isLoggedIn)
    );

    this.isLoggedOut$ = this.store
    .pipe(
      select(isLoggedOut)
    );

    // Load cart products if logged in, else empty cart (without deleting on account)
    this.isLoggedIn$.subscribe(loggedIn => {
      if (loggedIn) {
        // Initialize the product list
        this.store.dispatch(new AllProductsRequested());
        // Initialize the shopping cart
        this.store.dispatch(new AllCartItemsRequested());
        // Initialize the cart quantity
        this.store.dispatch(new CartQuantityRequested());
        // Initialize the product categories
        this.store.dispatch(new AllCategoriesRequested);
      } else {
        // Empty cart (local only)
        this.store.dispatch(new EmptyCartRequested());
        // Initialize the product list
        this.store.dispatch(new AllProductsRequested());
        // Initialize the shopping cart
        this.store.dispatch(new AllCartItemsRequested());
        // Initialize the cart quantity
        this.store.dispatch(new CartQuantityRequested());
        // Initialize the product categories
        this.store.dispatch(new AllCategoriesRequested);
      }
    });


    // Query the cart item quantity
    this.cartItemQuantity$ = this.store.pipe(select(
      selectCartItemQuantity
    ));

  }

  get localUser(): AppUser {
    return this.userService.localStorageUserData;
  }

  logout() {
    console.log('Dispatching Logout to store');
    this.auth.signOut();
    this.store.dispatch(new Logout());
    this.router.navigate(['/login']);
    // Empty local storage cart
    localStorage.removeItem('cart');
  }

}

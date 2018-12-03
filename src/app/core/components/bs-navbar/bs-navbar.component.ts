import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';
import { AppUser } from 'src/app/shared/models/app-user';
import {
  RootStoreState,
  AuthStoreSelectors,
  ProductsStoreActions,
  ShoppingCartStoreActions,
  CategoriesStoreActions,
  ShoppingCartStoreSelectors,
  AuthStoreActions
} from 'src/app/root-store';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.scss']
})
export class BsNavbarComponent implements OnInit {

  isNavbarCollapsed = true;

  cartItemQuantity$: Observable<number>;

  appUser$: Observable<AppUser>;

  constructor(
    public auth: AuthService,
    private store$: Store<RootStoreState.State>,
    public userService: UserService) { }

  ngOnInit() {
    // This select function ensures observable only emits on actual changes to auth (vs other state changes)
    this.appUser$ = this.store$.select(
      AuthStoreSelectors.selectAppUser
    );

    // Load cart products if logged in, else empty cart (without deleting on account)
    this.appUser$.subscribe(appUser => {
      if (appUser) {
        // Initialize the product list
        this.store$.dispatch(new ProductsStoreActions.AllProductsRequested());
        // Initialize the shopping cart
        this.store$.dispatch(new ShoppingCartStoreActions.AllCartItemsRequested());
        // Initialize the cart quantity
        this.store$.dispatch(new ShoppingCartStoreActions.CartQuantityRequested());
        // Initialize the cart total price
        this.store$.dispatch(new ShoppingCartStoreActions.CartTotalPriceRequested());
        // Initialize the product categories
        this.store$.dispatch(new CategoriesStoreActions.AllCategoriesRequested());
      } else {
        // // Empty cart (local only)
        // this.store$.dispatch(new ShoppingCartStoreActions.EmptyCartRequested());
        // Initialize the product list
        this.store$.dispatch(new ProductsStoreActions.AllProductsRequested());
        // Initialize the shopping cart
        this.store$.dispatch(new ShoppingCartStoreActions.AllCartItemsRequested());
        // Initialize the cart quantity
        this.store$.dispatch(new ShoppingCartStoreActions.CartQuantityRequested());
        // Initialize the cart total price
        this.store$.dispatch(new ShoppingCartStoreActions.CartTotalPriceRequested());
        // Initialize the product categories
        this.store$.dispatch(new CategoriesStoreActions.AllCategoriesRequested());
      }
    });


    // Query the cart item quantity
    this.cartItemQuantity$ = this.store$.select(
      ShoppingCartStoreSelectors.selectCartItemQuantity
    );

  }

  logout() {
    this.store$.dispatch(new AuthStoreActions.LoggedOut());
    // Since already signed out above, this will be a local removal only (rather than deleted user's database cart)
    this.store$.dispatch(new ShoppingCartStoreActions.EmptyCartRequested());
  }

}

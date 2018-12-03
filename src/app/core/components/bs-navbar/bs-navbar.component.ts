import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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

  appUserInStore: boolean;

  constructor(
    private authService: AuthService,
    private store$: Store<RootStoreState.State>,
  ) { }

  ngOnInit() {
    this.appUser$ = this.store$.select(
      AuthStoreSelectors.selectAppUser
    );

    // Load cart products if logged in,
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
        this.appUserInStore = true;
      } else {
        this.appUserInStore = false;
      }
    });

    // Logout happens faster in the store than in the authservice so this is used to delay empty cart until auth is ready
    this.authService.firebaseUser$.subscribe(fbUser => {
      if (!fbUser && !this.appUserInStore) {
      this.store$.dispatch(new ShoppingCartStoreActions.EmptyCartRequested());
        // Initialize the cart quantity
        this.store$.dispatch(new ShoppingCartStoreActions.CartQuantityRequested());
        // Initialize the cart total price
        this.store$.dispatch(new ShoppingCartStoreActions.CartTotalPriceRequested());
      } else {
        // This loads the user into the store on a refresh without logout
        this.store$.dispatch(new AuthStoreActions.SaveLoginDataRequestedAction({user: fbUser}));
      }
    });


    // Query the cart item quantity
    this.cartItemQuantity$ = this.store$.select(
      ShoppingCartStoreSelectors.selectCartItemQuantity
    );

  }

  logout() {
    this.store$.dispatch(new AuthStoreActions.LoggedOut());
  }

}

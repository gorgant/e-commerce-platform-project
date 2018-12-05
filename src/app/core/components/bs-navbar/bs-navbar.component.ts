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
    // Retreive the app user from Store
    this.appUser$ = this.store$.select(
      AuthStoreSelectors.selectAppUser
    );

    // Query the cart item quantity
    this.cartItemQuantity$ = this.store$.select(
      ShoppingCartStoreSelectors.selectCartItemQuantity
    );

    // Initialize the cart quantity
    this.store$.dispatch(new ShoppingCartStoreActions.CartQuantityRequested());
    // Initialize the cart total price
    this.store$.dispatch(new ShoppingCartStoreActions.CartTotalPriceRequested());

    // Helpers based on Store user (relies on auth at login, empties faster than auth on logout)
    this.appUser$.subscribe(appUser => {
      if (appUser) {
        // Initialize the shopping cart (Products initialized by categories in filter component)
        this.store$.dispatch(new ShoppingCartStoreActions.AllCartItemsRequested());
        // This assists the refresh logic in the auth service fucntion below
        this.appUserInStore = true;
      } else {
        this.appUserInStore = false;
      }
    });

    // Helpers based on FB (auth) user (loads faster than store on login, lingers longer than store on logout)
    this.authService.firebaseUser$.subscribe(fbUser => {
      if (fbUser && !this.appUserInStore) {
        // This loads the user into the store on a refresh without logout (which clears store but not FB user)
        this.store$.dispatch(new AuthStoreActions.SaveLoginDataRequestedAction({user: fbUser}));
      }

      // Logout happens faster in the store than in the authservice so this is used to delay empty cart until FB user is gone
      if (!fbUser) {
        // Empty cart (local only because no connection to Firebase bc no FB user)
        this.store$.dispatch(new ShoppingCartStoreActions.EmptyCartRequested());
      }
    });
  }

  logout() {
    this.store$.dispatch(new AuthStoreActions.LoggedOut());
  }

}

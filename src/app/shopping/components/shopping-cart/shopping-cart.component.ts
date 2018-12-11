import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingCartItem } from 'src/app/shared/models/shopping-cart-item';
import { Store } from '@ngrx/store';
import { RootStoreState, ShoppingCartStoreSelectors, ShoppingCartStoreActions, AuthStoreSelectors } from 'src/app/root-store';
import { AppUser } from 'src/app/shared/models/app-user';
import { take } from 'rxjs/operators';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  appUser$: Observable<AppUser>;
  shoppingCartItems$: Observable<ShoppingCartItem[]>;
  cartItemQuantity$: Observable<number>;
  cartTotalPrice$: Observable<number>;


  constructor(
    private store$: Store<RootStoreState.State>,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    // Retreive the app user from Store
    this.appUser$ = this.store$.select(AuthStoreSelectors.selectAppUser);

    // Products, cart items, and item quantity already initialized in the nav bar component
    // Fetch cart items from store
    this.shoppingCartItems$ = this.store$.select(ShoppingCartStoreSelectors.selectAllCartItems);

    // Query the cart item quantity
    this.cartItemQuantity$ = this.store$.select(ShoppingCartStoreSelectors.selectCartItemQuantity);

    // Query the cart total price
    this.cartTotalPrice$ = this.store$.select(ShoppingCartStoreSelectors.selectCartTotalPrice);
  }

  emptyCart() {
    this.store$.dispatch(new ShoppingCartStoreActions.EmptyCartRequested());
  }
}

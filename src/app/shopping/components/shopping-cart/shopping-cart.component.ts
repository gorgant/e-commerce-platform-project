import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingCartItem } from 'src/app/shared/models/shopping-cart-item';
import { Store } from '@ngrx/store';
import { RootStoreState, ShoppingCartStoreSelectors, ShoppingCartStoreActions } from 'src/app/root-store';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  shoppingCartItems$: Observable<ShoppingCartItem[]>;
  cartItemQuantity$: Observable<number>;
  cartTotalPrice$: Observable<number>;

  constructor(
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {

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

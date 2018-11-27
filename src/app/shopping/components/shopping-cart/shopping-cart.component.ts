import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingCartItem } from 'src/app/shared/models/shopping-cart-item';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { EmptyCartRequested } from 'src/app/shared/store/shopping-cart.actions';
import { selectAllCartItems, selectCartItemQuantity, selectCartTotalPrice } from 'src/app/shared/store/shopping-cart.selectors';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  shoppingCartItems$: Observable<ShoppingCartItem[]>;
  cartItemQuantity$: Observable<number>;
  cartTotalPrice$: Observable<number>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {

    // Products, cart items, and item quantity initialized in the nav bar component
    // Fetch cart items from store
    this.shoppingCartItems$ = this.store.pipe(select(selectAllCartItems));

    // Query the cart item quantity
    this.cartItemQuantity$ = this.store.pipe(select(
      selectCartItemQuantity
    ));

    // Query the cart total price
    this.cartTotalPrice$ = this.store.pipe(select(
      selectCartTotalPrice
    ));
  }

  emptyCart() {
    this.store.dispatch(new EmptyCartRequested());
    localStorage.removeItem('cart');
  }
}

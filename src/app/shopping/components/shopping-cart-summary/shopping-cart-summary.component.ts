import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootStoreState, ShoppingCartStoreSelectors } from 'src/app/root-store';
import { Observable } from 'rxjs';
import { ShoppingCartItem } from 'src/app/shared/models/shopping-cart-item';

@Component({
  selector: 'shopping-cart-summary',
  templateUrl: './shopping-cart-summary.component.html',
  styleUrls: ['./shopping-cart-summary.component.scss']
})
export class ShoppingCartSummaryComponent implements OnInit {

  shoppingCartItems$: Observable<ShoppingCartItem[]>;
  cartItemQuantity$: Observable<number>;
  cartTotalPrice$: Observable<number>;

  constructor(
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {

    // Fetch cart items from store
    this.shoppingCartItems$ = this.store$.select(ShoppingCartStoreSelectors.selectAllCartItems);

    // Query the cart item quantity
    this.cartItemQuantity$ = this.store$.select(ShoppingCartStoreSelectors.selectCartItemQuantity);

    // Query the cart total price
    this.cartTotalPrice$ = this.store$.select(ShoppingCartStoreSelectors.selectCartTotalPrice);
  }

}

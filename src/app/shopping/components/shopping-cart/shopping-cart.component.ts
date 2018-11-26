import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingCartItem } from 'src/app/shared/models/shopping-cart-item';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { EmptyCartRequested } from 'src/app/shared/store/shopping-cart.actions';
import { selectAllCartItems, selectCartItemQuantity } from 'src/app/shared/store/shopping-cart.selectors';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  shoppingCartItems$: Observable<ShoppingCartItem[]>;
  cartItemQuantity$: Observable<number>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {

    // Product and cart initialized in Navbar
    // Fetch cart items from store
    this.shoppingCartItems$ = this.store.pipe(select(selectAllCartItems));

    // Item quantity initialized in the nav bar component
    // Query the cart item quantity
    this.cartItemQuantity$ = this.store.pipe(select(
      selectCartItemQuantity
    ));


    // this.authSubscription = this.authService.appUser$.subscribe( user => {
    //   if (user) {
    //     this.shoppingCartService.loadCartProducts();
    //     console.log('Logged in, cart loaded');
    //   } else {
    //     this.clearCart();
    //     console.log('Not logged in, cart cleared');
    //   }
    // });
  }

  emptyCart() {
    this.store.dispatch(new EmptyCartRequested());
  }
}

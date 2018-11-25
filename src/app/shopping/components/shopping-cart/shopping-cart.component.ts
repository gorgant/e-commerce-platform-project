import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Observable } from 'rxjs';
import { ShoppingCartItem } from 'src/app/shared/models/shopping-cart-item';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { AllCartItemsRequested, EmptyCartRequested } from 'src/app/shared/store/shopping-cart.actions';
import { selectAllCartItems } from 'src/app/shared/store/shopping-cart.selectors';
import { AllProductsRequested } from 'src/app/shared/store/product.actions';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  shoppingCartItems$: Observable<ShoppingCartItem[]>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    // This populates the product list on initialization, and only updates if changes to the list
    // This is a prequesite for fetching the cart items (which reference the product list in the shopping cart service)
    this.store.dispatch(new AllProductsRequested());

    // This populates the cart item list on initialization, and only updates if changes to the list
    this.store.dispatch(new AllCartItemsRequested);


    this.shoppingCartItems$ = this.store.pipe(select(selectAllCartItems));


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

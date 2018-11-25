import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { ShoppingCartItem } from 'src/app/shared/models/shopping-cart-item';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { AllCartItemsRequested } from 'src/app/shared/store/shopping-cart.actions';
import { selectAllCartItems } from 'src/app/shared/store/shopping-cart.selectors';
import { AllProductsRequested } from 'src/app/shared/store/product.actions';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {

  shoppingCartItems$: Observable<ShoppingCartItem[]>;

  authSubscription: Subscription;

  constructor(
    public shoppingCartService: ShoppingCartService,
    public userService: UserService,
    private authService: AuthService,
    private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(new AllProductsRequested());

    // This populates the course list on initialization, and only updates if changes to the list
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

  clearCart() {
    this.shoppingCartService.clearShoppingCart();
  }

  emptyCart() {
    this.shoppingCartService.deleteAllCartItems();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

}

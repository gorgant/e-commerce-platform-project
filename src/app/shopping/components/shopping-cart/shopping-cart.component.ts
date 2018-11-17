import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';
import { ShoppingCartItem } from 'src/app/shared/models/shopping-cart-item';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {

  // shoppingCartItems$: Observable<ShoppingCartItem[]>;

  authSubscription: Subscription;

  constructor(
    public shoppingCartService: ShoppingCartService,
    public userService: UserService,
    private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.appUser$.subscribe( user => {
      if (user) {
        this.shoppingCartService.loadCartProducts();
        console.log('Logged in, cart loaded');
      } else {
        this.clearCart();
        console.log('Not logged in, cart cleared');
      }
    });
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

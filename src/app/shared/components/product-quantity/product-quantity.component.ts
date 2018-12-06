import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCartItem } from '../../models/shopping-cart-item';
import { Product } from '../../models/product';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, ShoppingCartStoreActions, ShoppingCartStoreSelectors, AuthStoreSelectors } from 'src/app/root-store';
import { AppUser } from '../../models/app-user';

@Component({
  selector: 'product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.scss']
})
export class ProductQuantityComponent implements OnInit {

  @Input('currentProduct') currentProduct: Product;

  storeCartItem$: Observable<ShoppingCartItem>;

  addToCartClicked: boolean;

  appUser$: Observable<AppUser>;

  constructor(
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {
    this.storeCartItem$ = this.store$.select(ShoppingCartStoreSelectors.selectCartItemById(this.currentProduct.productId));

    this.appUser$ = this.store$.select(AuthStoreSelectors.selectAppUser);
  }

  addToCart(product: Product) {
    this.store$.dispatch(new ShoppingCartStoreActions.AddCartItemRequested({product: product}));
  }

  incrementCartItem(cartItem: ShoppingCartItem) {
    this.store$.dispatch(new ShoppingCartStoreActions.IncrementCartItemRequested({cartItem: cartItem}));
  }

  decrementCartItem(cartItem: ShoppingCartItem) {
    // Delete item if only one left
    if (cartItem.quantity > 1) {
      this.store$.dispatch(new ShoppingCartStoreActions.DecrementCartItemRequested({cartItem: cartItem}));
    } else {
      this.store$.dispatch(new ShoppingCartStoreActions.DeleteCartItemRequested({cartItemId: cartItem.cartItemId}));
    }
  }
}

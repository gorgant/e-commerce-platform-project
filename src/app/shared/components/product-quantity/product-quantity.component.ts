import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCartItem } from '../../models/shopping-cart-item';
import { Product } from '../../models/product';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import {
  IncrementCartItemRequested,
  DecrementCartItemRequested,
  AddCartItemRequested,
  DeleteCartItemRequested,
  AllCartItemsRequested
} from '../../store/shopping-cart.actions';
import { selectCartItemById } from '../../store/shopping-cart.selectors';
import { isLoggedIn } from 'src/app/core/auth.selectors';

@Component({
  selector: 'product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.scss']
})
export class ProductQuantityComponent implements OnInit {

  @Input('currentProduct') currentProduct: Product;

  storeCartItem$: Observable<ShoppingCartItem>;

  addToCartClicked: boolean;

  isLoggedIn$: Observable<boolean>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.storeCartItem$ = this.store.pipe(select(selectCartItemById(this.currentProduct.productId)));
    this.isLoggedIn$ = this.store.pipe(select(isLoggedIn));
  }

  addToCart(product: Product) {
    this.store.dispatch(new AddCartItemRequested({product: product}));
    this.isLoggedIn$.subscribe(loggedIn => {
      if (!loggedIn) {
        this.store.dispatch(new AllCartItemsRequested());
      }
    });
  }

  incrementCartItem(cartItem: ShoppingCartItem) {
    this.store.dispatch(new IncrementCartItemRequested({cartItem: cartItem}));
    this.isLoggedIn$.subscribe(loggedIn => {
      if (!loggedIn) {
        this.store.dispatch(new AllCartItemsRequested());
      }
    });
  }

  decrementCartItem(cartItem: ShoppingCartItem) {
    if (cartItem.quantity > 1) {
      this.store.dispatch(new DecrementCartItemRequested({cartItem: cartItem}));
    } else {
      this.store.dispatch(new DeleteCartItemRequested({cartItemId: cartItem.cartItemId}));
    }
    this.isLoggedIn$.subscribe(loggedIn => {
      if (!loggedIn) {
        this.store.dispatch(new AllCartItemsRequested());
      }
    });
  }
}

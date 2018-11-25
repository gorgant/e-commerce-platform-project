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
} from '../../store/shopping-cart.actions';
import { selectCartItemById } from '../../store/shopping-cart.selectors';

@Component({
  selector: 'product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.scss']
})
export class ProductQuantityComponent implements OnInit {

  @Input('currentProduct') currentProduct: Product;

  storeCartItem$: Observable<ShoppingCartItem>;

  addToCartClicked: boolean;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.storeCartItem$ = this.store.pipe(select(selectCartItemById(this.currentProduct.productId)));
  }

  addToCart(product: Product) {
    this.store.dispatch(new AddCartItemRequested({product: product}));
  }

  incrementCartItem(cartItem: ShoppingCartItem) {
    this.store.dispatch(new IncrementCartItemRequested({cartItem: cartItem}));
  }

  decrementCartItem(cartItem: ShoppingCartItem) {
    this.store.dispatch(new DecrementCartItemRequested({cartItem: cartItem}));
  }
}

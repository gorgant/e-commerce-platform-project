import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ShoppingCartItem } from '../../models/shopping-cart-item';
import { Product } from '../../models/product';
import { Observable, pipe } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import {
  IncrementCartItemRequested,
  DecrementCartItemRequested,
  AddCartItemRequested,
  AllCartItemsRequested
} from '../../store/shopping-cart.actions';
import { selectCartItemById } from '../../store/shopping-cart.selectors';

@Component({
  selector: 'product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.scss']
})
export class ProductQuantityComponent implements OnInit {

  // @Input('componentCartItem') componentCartItem: ShoppingCartItem;
  @Input('currentProduct') currentProduct: Product;

  storeCartItem$: Observable<ShoppingCartItem>;

  addToCartClicked: boolean;

  constructor(
    // public shoppingCartService: ShoppingCartService,
    private store: Store<AppState>
    ) { }

  ngOnInit() {
    // this.store.dispatch(new AllCartItemsRequested());

    this.storeCartItem$ = this.store.pipe(select(selectCartItemById(this.currentProduct.productId)));

    // if (this.currentProduct) {
    //   this.shoppingCartService.initializeCart();
    //   this.currentItem$ = this.shoppingCartItem;
    //   this.currentItem$.subscribe( item => {
    //     if (item && item.quantity > 0) {
    //       // console.log('initializing with quantity showing');
    //       this.addToCartClicked = true;
    //       // console.log(this.addToCartClicked);
    //       // console.log(item);
    //     } else {
    //       this.addToCartClicked = false;
    //     }
    //   });
    //   // This is to trigger the currentItem$ to initialize on pageload (not very elegant)
    //   this.currentItem$ = this.shoppingCartItem;
    // }
  }

  // onAdd(productId: string) {
  //   console.log('incrementing cart item with id', productId);
  //   this.shoppingCartService.addToCart(productId);
  //   this.addToCartClicked = true;
  // }

  // onSubtract(item: ShoppingCartItem) {
  //   console.log('Removing item with id ', item.cartItemId);
  //   this.shoppingCartService.removeFromCart(item);
  // }

  addToCart(product: Product) {
    this.store.dispatch(new AddCartItemRequested({product: product}));
  }

  incrementCartItem(cartItem: ShoppingCartItem) {
    this.store.dispatch(new IncrementCartItemRequested({cartItem: cartItem}));
  }

  decrementCartItem(cartItem: ShoppingCartItem) {
    this.store.dispatch(new DecrementCartItemRequested({cartItem: cartItem}));
  }



  // get shoppingCartItem() {
  //   // console.log('retrieving item info for product', this.currentProduct);
  //   return this.shoppingCartService.getSingleCartItem(this.currentProduct.productId);
  // }

}

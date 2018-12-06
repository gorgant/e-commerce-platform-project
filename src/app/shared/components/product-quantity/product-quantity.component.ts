import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ShoppingCartItem } from '../../models/shopping-cart-item';
import { Product } from '../../models/product';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, ShoppingCartStoreActions, ShoppingCartStoreSelectors, AuthStoreSelectors } from 'src/app/root-store';
import { AppUser } from '../../models/app-user';

@Component({
  selector: 'product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.scss']
})
export class ProductQuantityComponent implements OnInit, OnDestroy {

  @Input('currentProduct') currentProduct: Product;

  storeCartItem$: Observable<ShoppingCartItem>;

  addToCartClicked: boolean;

  appUser$: Observable<AppUser>;

  loginSubscription: Subscription;

  constructor(
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {
    this.storeCartItem$ = this.store$.select(ShoppingCartStoreSelectors.selectCartItemById(this.currentProduct.productId));

    this.appUser$ = this.store$.select(AuthStoreSelectors.selectAppUser);
  }

  addToCart(product: Product) {
    this.store$.dispatch(new ShoppingCartStoreActions.AddCartItemRequested({product: product}));
    // // In offline mode, cart will only update if this is dispatched
    // this.loginSubscription = this.appUser$.subscribe(loggedIn => {
    //   if (!loggedIn) {
    //     this.store$.dispatch(new ShoppingCartStoreActions.AllCartItemsRequested());
    //   }
    // });
  }

  incrementCartItem(cartItem: ShoppingCartItem) {
    this.store$.dispatch(new ShoppingCartStoreActions.IncrementCartItemRequested({cartItem: cartItem}));

    // // In offline mode, cart will only update if this is dispatched
    // this.loginSubscription = this.appUser$.subscribe(loggedIn => {
    //   if (!loggedIn) {
    //     this.store$.dispatch(new ShoppingCartStoreActions.AllCartItemsRequested());
    //   }
    // });
  }

  decrementCartItem(cartItem: ShoppingCartItem) {
    // Delete item if only one left
    if (cartItem.quantity > 1) {
      this.store$.dispatch(new ShoppingCartStoreActions.DecrementCartItemRequested({cartItem: cartItem}));
    } else {
      this.store$.dispatch(new ShoppingCartStoreActions.DeleteCartItemRequested({cartItemId: cartItem.cartItemId}));
    }

    // // In offline mode, cart will only update if this is dispatched
    // this.loginSubscription = this.appUser$.subscribe(loggedIn => {
    //   if (!loggedIn) {
    //     this.store$.dispatch(new ShoppingCartStoreActions.AllCartItemsRequested());
    //   }
    // });
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

}

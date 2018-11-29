import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import {
  CartItemRequested,
  CartActionTypes,
  CartItemLoaded,
  AllCartItemsRequested,
  AllCartItemsLoaded,
  IncrementCartItemRequested,
  IncrementCartItemComplete,
  DecrementCartItemRequested,
  DecrementCartItemComplete,
  AddCartItemRequested,
  AddCartItemComplete,
  DeleteCartItemRequested,
  DeleteCartItemComplete,
  EmptyCartRequested,
  EmptyCartComplete,
  CartQuantityRequested,
  CartQuantitySet,
  UpdateCartItemProductComplete,
  UpsertOfflineCartItemsComplete,
  CartTotalPriceRequested,
  CartTotalPriceSet
 } from './shopping-cart.actions';
import { mergeMap, map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { selectAllCartItemsLoaded, selectAllCartItems } from './shopping-cart.selectors';
import { Update } from '@ngrx/entity';
import { ShoppingCartItem } from '../models/shopping-cart-item';
import { Subscription, of } from 'rxjs';
import { selectProductById } from './product.selectors';
import { isLoggedIn } from 'src/app/core/auth.selectors';

@Injectable()
export class ShoppingCartEffects {

  storeSubscription: Subscription;

  @Effect()
  loadCartItem$ = this.actions$
    .pipe(
      ofType<CartItemRequested>(CartActionTypes.CartItemRequested),
      // Using mergeMap instead of switchMap b/c that will ensure multiple requests can run in parallel
      mergeMap(action => this.shoppingCartService.getSingleCartItem(action.payload.cartItemId)),
      // Now lets return the result (an observable of the mergmap value) which gets sent to the store and is saved used the reducer
      map(cartItem => new CartItemLoaded({cartItem})),
    );

  @Effect({dispatch: false})
  loadAllCartItems$ = this.actions$
    .pipe(
      ofType<AllCartItemsRequested>(CartActionTypes.AllCartItemsRequested),
      // This is the best way to get a "snapshot" of the state without causing an infinite loop which happens if you just pipe a select
      withLatestFrom(
        this.store.pipe(select(selectAllCartItemsLoaded)),
        this.store.pipe(select(selectAllCartItems)),
        this.store.pipe(select(isLoggedIn)),
        ),
      filter(([action, allCartItemsLoadedVal, cartItems, loggedIn]) => !allCartItemsLoadedVal),
      // Call api for data if logged in, otherwise load from store
      mergeMap(([action, allCartItemsLoadedVal, cartItems, loggedIn]) => {
        if (loggedIn) {
          console.log('Logged in, initiating cart merge');
          if (localStorage.getItem('cart')) {
            const offlineCart: ShoppingCartItem[] = JSON.parse(localStorage.getItem('cart'));
            console.log('Offline Cart', offlineCart);
            this.shoppingCartService.upsertOfflineCartItems(offlineCart);
            this.store.dispatch(new UpsertOfflineCartItemsComplete({offlineCartItems: offlineCart}));
          }
          return this.shoppingCartService.getAllCartItems();
        } else {
          // This prevents local storage cart from being deleted during the refresh cycle during redirect logging in
          if (cartItems.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
            console.log('Cart items set in local storage', cartItems);
          }
          return of(cartItems);
        }
      }),
      tap(cartItems => {
        this.store.dispatch(new AllCartItemsLoaded({cartItems: cartItems}));
        console.log('Updated cart items without products', cartItems);
      }),
      // This bottom section updates the cart items with the latest product data (if changed since last added to cart)
      mergeMap(cartItems => cartItems),
      map(cartItem => {
        this.storeSubscription = this.store.pipe(select(selectProductById(cartItem.productId)))
          .subscribe(product => {
            const updatedCartItem: Update<ShoppingCartItem> = {
              id: cartItem.cartItemId,
              changes: {
                productId: cartItem.productId,
                quantity: cartItem.quantity,
                product: product
              }
            };
            if (product) {
              this.store.dispatch(new UpdateCartItemProductComplete({cartItem: updatedCartItem}));
              console.log('Updated cart item store with this item', updatedCartItem);
            }
          });
      }),
    );

  @Effect()
  incrementCartItem$ = this.actions$
    .pipe(
      ofType<IncrementCartItemRequested>(CartActionTypes.IncrementCartItemRequested),
      mergeMap(action => this.shoppingCartService.incrementCartItem(action.payload.cartItem)),
      map(cartItem => {
        const updatedCartItem: Update<ShoppingCartItem> = {
          id: cartItem.cartItemId,
          changes: cartItem
        };
        return new IncrementCartItemComplete({cartItem: updatedCartItem});
      })
    );

  @Effect()
  decrementCartItem$ = this.actions$
    .pipe(
      ofType<DecrementCartItemRequested>(CartActionTypes.DecrementCartItemRequested),
      mergeMap(action => this.shoppingCartService.decrementCartItem(action.payload.cartItem)),
      map(cartItem => {
        const updatedCartItem: Update<ShoppingCartItem> = {
          id: cartItem.cartItemId,
          changes: cartItem
        };
        return new DecrementCartItemComplete({cartItem: updatedCartItem});
      })
    );

  @Effect()
  addCartItem$ = this.actions$
    .pipe(
      ofType<AddCartItemRequested>(CartActionTypes.AddCartItemRequested),
      mergeMap(action => this.shoppingCartService.createCartItem(action.payload.product)),
      map(newCartItem => new AddCartItemComplete({cartItem: newCartItem}))
    );

  @Effect()
  deleteProduct$ = this.actions$
    .pipe(
      ofType<DeleteCartItemRequested>(CartActionTypes.DeleteCartItemRequested),
      mergeMap(action => this.shoppingCartService.deleteCartItem(action.payload.cartItemId)),
      map(cartItemId => new DeleteCartItemComplete({cartItemId: cartItemId}))
    );

  @Effect()
  emptyCart$ = this.actions$
      .pipe(
        ofType<EmptyCartRequested>(CartActionTypes.EmptyCartRequested),
        mergeMap(action => this.shoppingCartService.deleteAllCartItems()),
        map(() => new EmptyCartComplete())
      );

  @Effect()
  setCartQuantity$ = this.actions$
    .pipe(
      ofType<CartQuantityRequested>(CartActionTypes.CartQuantityRequested),
      mergeMap(action => this.store.pipe(select(selectAllCartItems))),
      map(cartItems => {
        // This reduce function scans the array and spits out a final value
        const cartQuantity = cartItems.reduce(((valueStore, item) => valueStore + item.quantity), 0);
        return new CartQuantitySet({cartItemQuantity: cartQuantity});
      }),
    );

  @Effect()
  setCartPrice$ = this.actions$
    .pipe(
      ofType<CartTotalPriceRequested>(CartActionTypes.CartTotalPriceRequested),
      mergeMap(action => this.store.pipe(select(selectAllCartItems))),
      map(cartItems => {
        // This reduce function scans the array and spits out a final value
        const cartTotalPrice = cartItems.reduce(((valueStore, item) => valueStore + (item.quantity * item.product.price)), 0);
        return new CartTotalPriceSet({cartTotalPrice: cartTotalPrice});
      }),
    );


  constructor(
    private actions$: Actions,
    private shoppingCartService: ShoppingCartService,
    private store: Store<AppState>
    ) { }

}

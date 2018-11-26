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
  UpdateCartItemProductComplete
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
      // This combines the previous observable with the current one
      withLatestFrom(this.store.pipe(select(selectAllCartItemsLoaded)), this.store.pipe(select(selectAllCartItems))),
      // tap(([action, allCartItemsLoadedVal, cartItems]) => {
      //   localStorage.setItem('cart', JSON.stringify(cartItems));
      //   console.log('Cart items set in local storage', cartItems);
      // }),
      // Ingest both observable values and filter out the observable and only trigger if the
      // courses haven't been loaded (only false makes it through)
      filter(([action, allCartItemsLoadedVal, cartItems]) => !allCartItemsLoadedVal),
      // Call api for data
      mergeMap(([action, allCartItemsLoadedVal, cartItems]) => {
        const userData = localStorage.getItem('user');
        if (userData) {
          return this.shoppingCartService.getAllCartItems();
        } else {
          localStorage.setItem('cart', JSON.stringify(cartItems));
          console.log('Cart items set in local storage', cartItems);
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
            this.store.dispatch(new UpdateCartItemProductComplete({cartItem: updatedCartItem}));
            console.log('Updated cart item store with this item', updatedCartItem);
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


  constructor(
    private actions$: Actions,
    private shoppingCartService: ShoppingCartService,
    private store: Store<AppState>
    ) { }

}

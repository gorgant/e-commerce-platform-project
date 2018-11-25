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
  EmptyCartComplete
 } from './shopping-cart.actions';
import { mergeMap, map, withLatestFrom, filter } from 'rxjs/operators';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { selectAllCartItemsLoaded } from './shopping-cart.selectors';
import { Update } from '@ngrx/entity';
import { ShoppingCartItem } from '../models/shopping-cart-item';

@Injectable()
export class ShoppingCartEffects {

  @Effect()
  loadCartItem$ = this.actions$
    .pipe(
      ofType<CartItemRequested>(CartActionTypes.CartItemRequested),
      // Using mergeMap instead of switchMap b/c that will ensure multiple requests can run in parallel
      mergeMap(action => this.shoppingCartService.getSingleCartItem(action.payload.cartItemId)),
      // Now lets return the result (an observable of the mergmap value) which gets sent to the store and is saved used the reducer
      map(cartItem => new CartItemLoaded({cartItem})),
    );

  @Effect()
  loadAllCartItems$ = this.actions$
    .pipe(
      ofType<AllCartItemsRequested>(CartActionTypes.AllCartItemsRequested),
      // This combines the previous observable with the current one
      withLatestFrom(this.store.pipe(select(selectAllCartItemsLoaded))),
      // Ingest both observable values and filter out the observable and only trigger if the
      // courses haven't been loaded (only false makes it through)
      filter(([action, allCartItemsLoadedVal]) => !allCartItemsLoadedVal),
      // Call api for data
      mergeMap(action => this.shoppingCartService.getAllCartItems()),
      // Take results and trigger an action
      map(cartItems => new AllCartItemsLoaded({cartItems: cartItems}))
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

  constructor(
    private actions$: Actions,
    private shoppingCartService: ShoppingCartService,
    private store: Store<AppState>
    ) { }

}

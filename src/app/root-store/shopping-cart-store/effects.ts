import { Injectable } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Store, Action } from '@ngrx/store';
import { RootStoreState } from '..';

import * as featureActions from './actions';
import * as featureSelectors from './selectors';
import { mergeMap, map, catchError, withLatestFrom, filter, tap, switchMap } from 'rxjs/operators';
import { ShoppingCartItem } from 'src/app/shared/models/shopping-cart-item';
import { Update } from '@ngrx/entity';
import { selectProductById } from '../products-store/selectors';
import { selectAppUser } from '../auth-store/selectors';

@Injectable()
export class ShoppingCartStoreEffects {

  storeSubscription: Subscription;

  constructor(
    private actions$: Actions,
    private shoppingCartService: ShoppingCartService,
    private store$: Store<RootStoreState.State>
    ) { }

  @Effect()
  loadAllCartItemsEffect$: Observable<Action> = this.actions$
    .pipe(
      ofType<featureActions.AllCartItemsRequested>(
        featureActions.ActionTypes.ALL_CART_ITEMS_REQUESTED),
      // This is the best way to get a "snapshot" of the state without causing an infinite loop which happens if you just pipe a select
      withLatestFrom(
        this.store$.select(featureSelectors.selectAllCartItems),
        // The presence of an app user is determined using the auth store
        this.store$.select(selectAppUser),
        ),
      // Call api for data if logged in, otherwise load from store
      mergeMap(([action, cartItems, appUser]) => {
        // If logged in, merge offline cart (if exists) into database cart and pull from database
        if (appUser) {
          console.log('Logged in, checking for offline cart');
          const offlineCartData = localStorage.getItem('offlineCart');
          // If offline cart, merge that into database cart
          if (offlineCartData) {
            // Extract data from offline cart if it exists
            const offlineCart: ShoppingCartItem[] = JSON.parse(localStorage.getItem('offlineCart'));
            console.log('Offline cart found, extracting offline cart', offlineCart);
            // Now remove the offline cart because we don't want it to keep loading
            localStorage.removeItem('offlineCart');
            // NEW: This new service batch uploads the offline cart items to the database and returns the updated cart list
            return this.shoppingCartService.batchedUpsertOfflineCartItems(offlineCart).pipe(
              map(cartItemList => {
                const updatedCartItems: ShoppingCartItem[] = [];
                cartItemList.map(cartItem => {
                  this.storeSubscription = this.store$.select(selectProductById(cartItem.productId))
                    .subscribe(product => {
                      const itemWithProduct: ShoppingCartItem = {
                          cartItemId: cartItem.cartItemId,
                          productId: cartItem.productId,
                          quantity: cartItem.quantity,
                          product: product
                      };
                    updatedCartItems.push(itemWithProduct);
                  });
                });
                console.log('Dispatching all cart items loaded');
              return new featureActions.AllCartItemsLoaded({cartItems: updatedCartItems});
              })
            );
          } else {
            // If no offline cart, just pull the cart form the database
            console.log('No offline cart found, pulling cart directly from databse');
            return this.shoppingCartService.getAllCartItems().pipe(
              map(cartItemList => {
                const updatedCartItems: ShoppingCartItem[] = [];
                cartItemList.map(cartItem => {
                  this.storeSubscription = this.store$.select(selectProductById(cartItem.productId))
                    .subscribe(product => {
                      const itemWithProduct: ShoppingCartItem = {
                          cartItemId: cartItem.cartItemId,
                          productId: cartItem.productId,
                          quantity: cartItem.quantity,
                          product: product
                      };
                    updatedCartItems.push(itemWithProduct);
                  });
                });
                console.log('Dispatching all cart items loaded');
              return new featureActions.AllCartItemsLoaded({cartItems: updatedCartItems});
              })
            );
          }
        } else {
          console.log('Not logged in, initializing offline cart');
          // If not logged in, update offline cart
          // This prevents local storage cart from being deleted during the refresh cycle during redirect logging in
          if (cartItems.length > 0) {
            localStorage.setItem('offlineCart', JSON.stringify(cartItems));
            console.log('Cart items set in local storage', cartItems);
          }
          return of(cartItems).pipe(
            map(cartItemList => {
              const updatedCartItems: ShoppingCartItem[] = [];
              cartItemList.map(cartItem => {
                this.storeSubscription = this.store$.select(selectProductById(cartItem.productId))
                  .subscribe(product => {
                    const itemWithProduct: ShoppingCartItem = {
                        cartItemId: cartItem.cartItemId,
                        productId: cartItem.productId,
                        quantity: cartItem.quantity,
                        product: product
                    };
                  updatedCartItems.push(itemWithProduct);
                });
              });
              console.log('Dispatching all cart items loaded');
            return new featureActions.AllCartItemsLoaded({cartItems: updatedCartItems});
            })
          );
        }
      }),
    );

  @Effect()
  incrementCartItemEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.IncrementCartItemRequested>(
      featureActions.ActionTypes.INCREMENT_CART_ITEM_REQUESTED
    ),
    withLatestFrom(this.store$.select(selectAppUser)),
    mergeMap(([action, user]) => {
      // if (user) {
        return this.shoppingCartService.incrementCartItem(action.payload.cartItem).pipe(
          map(cartItem => {
            const updatedCartItem: Update<ShoppingCartItem> = {
              id: cartItem.cartItemId,
              changes: cartItem
            };
            return new featureActions.IncrementCartItemComplete({cartItem: updatedCartItem});
          })
        );
      // } else {
      //   const updatedCartItem: Update<ShoppingCartItem> = {
      //     id: action.payload.cartItem.cartItemId,
      //     changes: action.payload.cartItem
      //   };
      //   return of(new featureActions.IncrementCartItemComplete({cartItem: updatedCartItem}));
      // }
    })
  );

  @Effect()
  decrementCartItemEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.DecrementCartItemRequested>(
      featureActions.ActionTypes.DECREMENT_CART_ITEM_REQUESTED
    ),
    mergeMap(action => this.shoppingCartService.decrementCartItem(action.payload.cartItem).pipe(
      map(cartItem => {
        const updatedCartItem: Update<ShoppingCartItem> = {
          id: cartItem.cartItemId,
          changes: cartItem
        };
        return new featureActions.DecrementCartItemComplete({cartItem: updatedCartItem});
      }),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    ))
  );

  @Effect()
  addCartItemEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AddCartItemRequested>(
      featureActions.ActionTypes.ADD_CART_ITEM_REQUESTED
    ),
    mergeMap(action => this.shoppingCartService.createCartItem(action.payload.product).pipe(
      map(newCartItem => new featureActions.AddCartItemComplete({cartItem: newCartItem})),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );

  @Effect()
  deleteProductEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.DeleteCartItemRequested>(featureActions.ActionTypes.DELETE_CART_ITEM_REQUESTED),
    mergeMap(action => this.shoppingCartService.deleteCartItem(action.payload.cartItemId).pipe(
      map(cartItemId => new featureActions.DeleteCartItemComplete({cartItemId: cartItemId})),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );

  @Effect()
  emptyCartEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.EmptyCartRequested>(featureActions.ActionTypes.EMPTY_CART_REQUESTED),
    mergeMap(action => this.shoppingCartService.altDeleteAllCartItems().pipe(
      map(() => new featureActions.EmptyCartComplete()),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    ))
  );

  @Effect()
  setCartQuantityEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.CartQuantityRequested>(featureActions.ActionTypes.CART_QUANTITY_REQUESTED),
    mergeMap(action => this.store$.select(featureSelectors.selectAllCartItems).pipe(
      map(cartItems => {
        // This reduce function scans the array and spits out a final value
        const cartQuantity = cartItems.reduce(((valueStore, item) => valueStore + item.quantity), 0);
        return new featureActions.CartQuantitySet({cartItemQuantity: cartQuantity});
      }),
    )),
  );

  @Effect()
  setCartPriceEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.CartTotalPriceRequested>(featureActions.ActionTypes.CART_TOTAL_PRICE_REQUESTED),
    mergeMap(action => this.store$.select(featureSelectors.selectAllCartItems).pipe(
      map(cartItems => {
        // This reduce function scans the array and spits out a final value
        const cartTotalPrice = cartItems.reduce(((valueStore, item) => valueStore + (item.quantity * item.product.price)), 0);
        return new featureActions.CartTotalPriceSet({cartTotalPrice: cartTotalPrice});
      }),
    )),
  );
}

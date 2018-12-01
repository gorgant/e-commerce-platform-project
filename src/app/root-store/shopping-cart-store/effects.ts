import { Injectable } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Store, Action, select } from '@ngrx/store';
import { RootStoreState } from '..';

import * as featureActions from './actions';
import { mergeMap, map, catchError, withLatestFrom, filter, tap, switchMap } from 'rxjs/operators';
import { ShoppingCartItem } from 'src/app/shared/models/shopping-cart-item';
import { ShoppingCartStoreSelectors } from '..';
import { ProductsStoreSelectors } from '../products-store';
import { Update } from '@ngrx/entity';
import { AuthStoreSelectors } from '../auth-store';

@Injectable()
export class ShoppingCartStoreEffects {

  storeSubscription: Subscription;

  constructor(
    private actions$: Actions,
    private shoppingCartService: ShoppingCartService,
    private store$: Store<RootStoreState.State>
    ) { }

  // @Effect()
  // loadCartItemEffect$: Observable<Action> = this.actions$.pipe(
  //   ofType<featureActions.CartItemRequested>(
  //     featureActions.ActionTypes.CART_ITEM_REQUESTED
  //   ),
  //   // Using mergeMap instead of switchMap b/c that will ensure multiple requests can run in parallel
  //   mergeMap(action => this.shoppingCartService.getSingleCartItem(action.payload.cartItemId)),
  //   // Now lets return the result (an observable of the mergmap value) which gets sent to the store and is saved used the reducer
  //   map(cartItem => new featureActions.CartItemLoaded({cartItem})),
  // );

  @Effect()
  loadCartItemEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.CartItemRequested>(
      featureActions.ActionTypes.CART_ITEM_REQUESTED
    ),
    // Using mergeMap instead of switchMap b/c that will ensure multiple requests can run in parallel
    mergeMap(action => this.shoppingCartService.getSingleCartItem(action.payload.cartItemId).pipe(
      // Now lets return the result (an observable of the mergmap value) which gets sent to the store and is saved used the reducer
      map(cartItem => new featureActions.CartItemLoaded({cartItem})),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );


  // @Effect({dispatch: false})
  // loadAllCartItemsEffect$: Observable<void> = this.actions$
  //   .pipe(
  //     ofType<featureActions.AllCartItemsRequested>(
  //       featureActions.ActionTypes.ALL_CART_ITEMS_REQUESTED),
  //     // This is the best way to get a "snapshot" of the state without causing an infinite loop which happens if you just pipe a select
  //     withLatestFrom(
  //       this.store$.pipe(select(ShoppingCartStoreSelectors.selectCartItemsLoading)),
  //       this.store$.pipe(select(ShoppingCartStoreSelectors.selectAllCartItems)),
  //       this.store$.pipe(select(AuthStore.selectAppUser)),
  //       ),
  //     filter(([action, cartItemsLoading, cartItems, appUser]) => cartItemsLoading),
  //     // Call api for data if logged in, otherwise load from store
  //     mergeMap(([action, cartItemsLoading, cartItems, appUser]) => {
  //       // If logged in, merge cart into database cart
  //       if (appUser) {
  //         console.log('Logged in, initiating cart merge');
  //         if (localStorage.getItem('cart')) {
  //           const offlineCart: ShoppingCartItem[] = JSON.parse(localStorage.getItem('cart'));
  //           console.log('Offline Cart', offlineCart);
  //           this.shoppingCartService.upsertOfflineCartItems(offlineCart);
  //           this.store$.dispatch(new featureActions.UpsertOfflineCartItemsComplete({offlineCartItems: offlineCart}));
  //         }
  //         return this.shoppingCartService.getAllCartItems();
  //       } else {
  //         // This prevents local storage cart from being deleted during the refresh cycle during redirect logging in
  //         if (cartItems.length > 0) {
  //           localStorage.setItem('cart', JSON.stringify(cartItems));
  //           console.log('Cart items set in local storage', cartItems);
  //         }
  //         return of(cartItems);
  //       }
  //     }),
  //     tap(cartItems => {
  //       this.store$.dispatch(new featureActions.AllCartItemsLoaded({cartItems: cartItems}));
  //       console.log('Updated cart items without products', cartItems);
  //     }),
  //     // This bottom section updates the cart items with the latest product data from the store (if changed since last added to cart)
  //     mergeMap(cartItems => cartItems),
  //     map(cartItem => {
  //       this.storeSubscription = this.store$.pipe(select(ProductsStoreSelectors.selectProductById(cartItem.productId)))
  //         .subscribe(product => {
  //           const updatedCartItem: Update<ShoppingCartItem> = {
  //             id: cartItem.cartItemId,
  //             changes: {
  //               productId: cartItem.productId,
  //               quantity: cartItem.quantity,
  //               product: product
  //             }
  //           };
  //           if (product) {
  //             this.store$.dispatch(new featureActions.UpdateCartItemProductComplete({cartItem: updatedCartItem}));
  //             console.log('Updated cart item store with this item', updatedCartItem);
  //           }
  //         });
  //     }),
  //   );

  @Effect({dispatch: false})
  loadAllCartItemsEffect$: Observable<void> = this.actions$
    .pipe(
      ofType<featureActions.AllCartItemsRequested>(
        featureActions.ActionTypes.ALL_CART_ITEMS_REQUESTED),
      // This is the best way to get a "snapshot" of the state without causing an infinite loop which happens if you just pipe a select
      withLatestFrom(
        this.store$.pipe(select(ShoppingCartStoreSelectors.selectCartItemsLoading)),
        this.store$.pipe(select(ShoppingCartStoreSelectors.selectAllCartItems)),
        // The presence of an app user is determined using the auth store
        this.store$.pipe(select(AuthStoreSelectors.selectAppUser)),
        ),
      filter(([action, cartItemsLoading, cartItems, appUser]) => cartItemsLoading),
      // Call api for data if logged in, otherwise load from store
      switchMap(([action, cartItemsLoading, cartItems, appUser]) => {
        // If logged in, merge offline cart (if exists) into database cart and pull from database
        if (appUser) {
          console.log('Logged in, initiating cart merge');
          if (localStorage.getItem('offlineCart')) {
            // Extract data from offline cart if it exists
            const offlineCart: ShoppingCartItem[] = JSON.parse(localStorage.getItem('cart'));
            console.log('Offline Cart', offlineCart);
            // Now remove the offline cart because we don't want it to keep loading
            localStorage.removeItem('offlineCart');
            console.log('Offline cart removed');
            // NEW: This new service batch uploads the offline cart items to the database and returns the updated cart list
            return this.shoppingCartService.batchedUpsertOfflineCartItems(offlineCart).pipe(
            );
          }
        // If not logged in, update offline cart
        } else {
          // This length prevents local storage cart from being replaced by an empty one during the refresh cycle during redirect logging in
          if (cartItems.length > 0) {
            localStorage.setItem('offlineCart', JSON.stringify(cartItems));
            console.log('Cart items set in local storage', cartItems);
          }
          return of(cartItems);
        }
      }),
      // Dispatch the updated cart items to the store
      tap(cartItems => {
        this.store$.dispatch(new featureActions.AllCartItemsLoaded({cartItems: cartItems}));
        console.log('Updated cart items without products', cartItems);
      }),
      // CONSIDER RUNNING THIS OPERATION BEFORE COMMITING TO STORE (SAVING A BUNCH OF STORE CALLS TO UPDATE EACH CART ITEM)
      // This bottom section updates the cart items with the latest product data from the store (if changed since last added to cart)
      mergeMap(cartItems => cartItems),
      map(cartItem => {
        this.storeSubscription = this.store$.pipe(select(ProductsStoreSelectors.selectProductById(cartItem.productId)))
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
              this.store$.dispatch(new featureActions.UpdateCartItemProductComplete({cartItem: updatedCartItem}));
              console.log('Updated cart item store with this item', updatedCartItem);
            }
          });
      }),
    );

  // @Effect()
  // incrementCartItemEffect$: Observable<Action> = this.actions$.pipe(
  //   ofType<featureActions.IncrementCartItemRequested>(
  //     featureActions.ActionTypes.INCREMENT_CART_ITEM_REQUESTED
  //   ),
  //   mergeMap(action => this.shoppingCartService.incrementCartItem(action.payload.cartItem)),
  //   map(cartItem => {
  //     const updatedCartItem: Update<ShoppingCartItem> = {
  //       id: cartItem.cartItemId,
  //       changes: cartItem
  //     };
  //     return new featureActions.IncrementCartItemComplete({cartItem: updatedCartItem});
  //   })
  // );

  @Effect()
  incrementCartItemEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.IncrementCartItemRequested>(
      featureActions.ActionTypes.INCREMENT_CART_ITEM_REQUESTED
    ),
    mergeMap(action => this.shoppingCartService.incrementCartItem(action.payload.cartItem).pipe(
      map(cartItem => {
        const updatedCartItem: Update<ShoppingCartItem> = {
          id: cartItem.cartItemId,
          changes: cartItem
        };
        return new featureActions.IncrementCartItemComplete({cartItem: updatedCartItem});
      })
    ))
  );

  // @Effect()
  // decrementCartItemEffect$: Observable<Action> = this.actions$.pipe(
  //   ofType<featureActions.DecrementCartItemRequested>(featureActions.ActionTypes.DECREMENT_CART_ITEM_REQUESTED),
  //   mergeMap(action => this.shoppingCartService.decrementCartItem(action.payload.cartItem)),
  //   map(cartItem => {
  //     const updatedCartItem: Update<ShoppingCartItem> = {
  //       id: cartItem.cartItemId,
  //       changes: cartItem
  //     };
  //     return new featureActions.DecrementCartItemComplete({cartItem: updatedCartItem});
  //   })
  // );

  @Effect()
  decrementCartItemEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.DecrementCartItemRequested>(featureActions.ActionTypes.DECREMENT_CART_ITEM_REQUESTED),
    mergeMap(action => this.shoppingCartService.decrementCartItem(action.payload.cartItem).pipe(
      map(cartItem => {
        const updatedCartItem: Update<ShoppingCartItem> = {
          id: cartItem.cartItemId,
          changes: cartItem
        };
        return new featureActions.DecrementCartItemComplete({cartItem: updatedCartItem});
      })
    ))
  );

  // @Effect()
  // addCartItemEffect$: Observable<Action> = this.actions$.pipe(
  //   ofType<featureActions.AddCartItemRequested>(featureActions.ActionTypes.ADD_CART_ITEM_REQUESTED),
  //   mergeMap(action => this.shoppingCartService.createCartItem(action.payload.product)),
  //   map(newCartItem => new featureActions.AddCartItemComplete({cartItem: newCartItem}))
  // );

  @Effect()
  addCartItemEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AddCartItemRequested>(featureActions.ActionTypes.ADD_CART_ITEM_REQUESTED),
    mergeMap(action => this.shoppingCartService.createCartItem(action.payload.product).pipe(
      map(newCartItem => new featureActions.AddCartItemComplete({cartItem: newCartItem})),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );

  // @Effect()
  // deleteProductEffect$: Observable<Action> = this.actions$.pipe(
  //   ofType<featureActions.DeleteCartItemRequested>(featureActions.ActionTypes.DELETE_CART_ITEM_REQUESTED),
  //   mergeMap(action => this.shoppingCartService.deleteCartItem(action.payload.cartItemId)),
  //   map(cartItemId => new featureActions.DeleteCartItemComplete({cartItemId: cartItemId}))
  // );

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

  // @Effect()
  // emptyCartEffect$: Observable<Action> = this.actions$.pipe(
  //   ofType<featureActions.EmptyCartRequested>(featureActions.ActionTypes.EMPTY_CART_REQUESTED),
  //   mergeMap(action => this.shoppingCartService.deleteAllCartItems()),
  //   map(() => new featureActions.EmptyCartComplete())
  // );

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

  // @Effect()
  // setCartQuantityEffect$: Observable<Action> = this.actions$.pipe(
  //   ofType<featureActions.CartQuantityRequested>(featureActions.ActionTypes.CART_QUANTITY_REQUESTED),
  //   mergeMap(action => this.store$.pipe(select(ShoppingCartStoreSelectors.selectAllCartItems))),
  //   map(cartItems => {
  //     // This reduce function scans the array and spits out a final value
  //     const cartQuantity = cartItems.reduce(((valueStore, item) => valueStore + item.quantity), 0);
  //     return new featureActions.CartQuantitySet({cartItemQuantity: cartQuantity});
  //   }),
  // );

  @Effect()
  setCartQuantityEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.CartQuantityRequested>(featureActions.ActionTypes.CART_QUANTITY_REQUESTED),
    mergeMap(action => this.store$.pipe(select(ShoppingCartStoreSelectors.selectAllCartItems)).pipe(
      map(cartItems => {
        // This reduce function scans the array and spits out a final value
        const cartQuantity = cartItems.reduce(((valueStore, item) => valueStore + item.quantity), 0);
        return new featureActions.CartQuantitySet({cartItemQuantity: cartQuantity});
      }),
    )),
  );

  // @Effect()
  // setCartPriceEffect$: Observable<Action> = this.actions$.pipe(
  //   ofType<featureActions.CartTotalPriceRequested>(featureActions.ActionTypes.CART_TOTAL_PRICE_REQUESTED),
  //   mergeMap(action => this.store$.pipe(select(ShoppingCartStoreSelectors.selectAllCartItems))),
  //   map(cartItems => {
  //     // This reduce function scans the array and spits out a final value
  //     const cartTotalPrice = cartItems.reduce(((valueStore, item) => valueStore + (item.quantity * item.product.price)), 0);
  //     return new featureActions.CartTotalPriceSet({cartTotalPrice: cartTotalPrice});
  //   }),
  // );

  @Effect()
  setCartPriceEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.CartTotalPriceRequested>(featureActions.ActionTypes.CART_TOTAL_PRICE_REQUESTED),
    mergeMap(action => this.store$.pipe(select(ShoppingCartStoreSelectors.selectAllCartItems)).pipe(
      map(cartItems => {
        // This reduce function scans the array and spits out a final value
        const cartTotalPrice = cartItems.reduce(((valueStore, item) => valueStore + (item.quantity * item.product.price)), 0);
        return new featureActions.CartTotalPriceSet({cartTotalPrice: cartTotalPrice});
      }),
    )),
  );
}

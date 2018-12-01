import { Injectable } from '@angular/core';
import { RootStoreState, ProductsStoreSelectors } from '..';
import { Store, Action, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import * as featureActions from './actions';
import { ProductService } from 'src/app/shared/services/product.service';
import { mergeMap, map, withLatestFrom, filter, startWith, switchMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Update } from '@ngrx/entity';
import { Product } from 'src/app/shared/models/product';

@Injectable()
export class ProductStoreEffects {

  constructor(
    private actions$: Actions,
    private productService: ProductService,
    private store: Store<RootStoreState.State>
    ) {}

  // @Effect()
  // loadProductEffect$: Observable<Action> = this.actions$.pipe(
  //   ofType<featureActions.ProductRequested>(
  //     featureActions.ActionTypes.PRODUCT_REQUESTED
  //   ),
  //   // Using mergeMap instead of switchMap b/c that will ensure multiple requests can run in parallel
  //   mergeMap(action => this.productService.getSingleProduct(action.payload.productId)),
  //   // Now lets return the result (an observable of the mergmap value) which gets sent to the store and is saved used the reducer
  //   map(product => new featureActions.ProductLoaded({product: product})),
  // );

  // This is the version used by the itnext best practices guy
  @Effect()
  loadProductEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.ProductRequested>(
      featureActions.ActionTypes.PRODUCT_REQUESTED
    ),
    // Using mergeMap instead of switchMap b/c that will ensure multiple requests can run in parallel
    mergeMap(action => this.productService.getSingleProduct(action.payload.productId).pipe(
      // Now lets return the result (an observable of the mergmap value) which gets sent to the store and is saved used the reducer
      map(product => new featureActions.ProductLoaded({product: product})),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );

  // @Effect()
  // loadAllProductsEffect$ = this.actions$.pipe(
  //     ofType<featureActions.AllProductsRequested>(
  //       featureActions.ActionTypes.ALL_PRODUCTS_REQUESTED
  //     ),
  //     // This combines the previous observable with the current one
  //     withLatestFrom(this.store.pipe(select(ProductsStoreSelectors.selectProductsLoading))),
  //     // Ingest both observable values and filter out the observable and only trigger if the
  //     // courses haven't been loaded (only true makes it through)
  //     filter(([action, productsLoading]) => productsLoading),
  //     // Call api for data
  //     mergeMap(action => this.productService.getProducts()),
  //     // Take results and trigger an action
  //     map(products => new featureActions.AllProductsLoaded({products}))
  //   );

  // This is the version used by the itnext best practices guy
  @Effect()
  loadAllProductsEffect$ = this.actions$.pipe(
    ofType<featureActions.AllProductsRequested>(
      featureActions.ActionTypes.ALL_PRODUCTS_REQUESTED
    ),
    // This combines the previous observable with the current one
    withLatestFrom(this.store.pipe(select(ProductsStoreSelectors.selectProductsLoading))),
    // Ingest both observable values and filter out the observable and only trigger if the
    // courses haven't been loaded (only true makes it through)
    filter(([action, productsLoading]) => productsLoading),
    startWith(new featureActions.AllProductsRequested()),
    // Call api for data
    switchMap(action => this.productService.getProducts().pipe(
      // Take results and trigger an action
      map(products => new featureActions.AllProductsLoaded({products})),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );

  // @Effect()
  // updateProductEffect$: Observable<Action> = this.actions$.pipe(
  //   ofType<featureActions.UpdateProductRequested>(
  //     featureActions.ActionTypes.UPDATE_PRODUCT_REQUESTED
  //   ),
  //   mergeMap(action => this.productService.saveProduct(action.payload.product)),
  //   map(product => {
  //     const productUp: Update<Product> = {
  //       id: product.productId,
  //       changes: product
  //     };
  //     return new featureActions.UpdateProductComplete({product: productUp});
  //   })
  // );

  @Effect()
  updateProductEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateProductRequested>(
      featureActions.ActionTypes.UPDATE_PRODUCT_REQUESTED
    ),
    mergeMap(action => this.productService.saveProduct(action.payload.product).pipe(
      map(product => {
        const productUp: Update<Product> = {
          id: product.productId,
          changes: product
        };
        return new featureActions.UpdateProductComplete({product: productUp});
      }),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );

  // @Effect()
  // addProductEffect$ = this.actions$.pipe(
  //     ofType<featureActions.AddProductRequested>(
  //       featureActions.ActionTypes.ADD_PRODUCT_REQUESTED
  //     ),
  //     mergeMap(action => this.productService.createProduct(action.payload.product)),
  //     map(productWithId => new featureActions.AddProductRequested({product: productWithId}))
  // );

  @Effect()
  addProductEffect$ = this.actions$.pipe(
    ofType<featureActions.AddProductRequested>(
      featureActions.ActionTypes.ADD_PRODUCT_REQUESTED
    ),
    mergeMap(action => this.productService.createProduct(action.payload.product).pipe(
      map(productWithId => new featureActions.AddProductRequested({product: productWithId})),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );

  // @Effect()
  // deleteProductEffect$ = this.actions$.pipe(
  //   ofType<featureActions.DeleteProductRequested>(
  //     featureActions.ActionTypes.DELETE_PRODUCT_REQUESTED
  //   ),
  //   mergeMap(action => this.productService.deleteProduct(action.payload.productId)),
  //   map(prodId => new featureActions.DeleteProductRequested({productId: prodId}))
  // );

  @Effect()
  deleteProductEffect$ = this.actions$.pipe(
    ofType<featureActions.DeleteProductRequested>(
      featureActions.ActionTypes.DELETE_PRODUCT_REQUESTED
    ),
    mergeMap(action => this.productService.deleteProduct(action.payload.productId).pipe(
      map(prodId => new featureActions.DeleteProductRequested({productId: prodId})),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );

}

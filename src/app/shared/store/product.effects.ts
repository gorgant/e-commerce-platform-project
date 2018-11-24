import { Injectable } from '@angular/core';
import {
  ProductRequested,
  ProductActionTypes,
  ProductLoaded,
  AllProductsRequested,
  AllProductsLoaded,
  ProductUpdated,
  ProductUpdateRequested,
  ProductAddRequested,
  ProductAdded
} from './product.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ProductService } from '../services/product.service';
import { mergeMap, map, withLatestFrom, filter } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { allProductsLoaded } from './product.selectors';
import { Update } from '@ngrx/entity';
import { Product } from '../models/product';

@Injectable()
export class ProductEffects {

  @Effect()
  loadProduct$ = this.actions$
    .pipe(
      ofType<ProductRequested>(ProductActionTypes.ProductRequested),
      // Using mergeMap instead of switchMap b/c that will ensure multiple requests can run in parallel
      mergeMap(action => this.productService.getSingleProduct(action.payload.productId)),
      // Now lets return the result (an observable of the mergmap value) which gets sent to the store and is saved used the reducer
      map(product => new ProductLoaded({product})),
    );

  @Effect()
  loadAllProducts$ = this.actions$
    .pipe(
      ofType<AllProductsRequested>(ProductActionTypes.AllProductsRequested),
      // This combines the previous observable with the current one
      withLatestFrom(this.store.pipe(select(allProductsLoaded))),
      // Ingest both observable values and filter out the observable and only trigger if the
      // courses haven't been loaded (only false makes it through)
      filter(([action, allProductsLoadedVal]) => !allProductsLoadedVal),
      // Call api for data
      mergeMap(action => this.productService.getProducts()),
      // Take results and trigger an action
      map(products => new AllProductsLoaded({products}))
    );

  @Effect()
  updateProduct$ = this.actions$
    .pipe(
      ofType<ProductUpdateRequested>(ProductActionTypes.ProductUpdateRequested),
      mergeMap(action => this.productService.saveProduct(action.payload.product)),
      map(product => {
        const productUp: Update<Product> = {
          id: product.productId,
          changes: product
        };
        return new ProductUpdated({product: productUp});
      })
    );

    @Effect()
    addProduct$ = this.actions$
      .pipe(
        ofType<ProductAddRequested>(ProductActionTypes.ProductAddRequested),
        mergeMap(action => this.productService.createProduct(action.payload.product)),
        map(productWithId => new ProductAdded({product: productWithId}))
      );

  constructor(
    private actions$: Actions,
    private productService: ProductService,
    private store: Store<AppState>
    ) {}

}

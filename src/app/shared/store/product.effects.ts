import { Injectable } from '@angular/core';
import { ProductRequested, ProductActionTypes, ProductLoaded } from './product.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ProductService } from '../services/product.service';
import { mergeMap, map } from 'rxjs/operators';

@Injectable()
export class ProductEffects {

  @Effect()
  loadProduct$ = this.actions$
    .pipe(
      ofType<ProductRequested>(ProductActionTypes.ProductRequested),
      // Using mergeMap instead of switchMap b/c that will ensure multiple requests can run in parallel
      mergeMap(action => this.productService.getSingleProduct(action.payload.productId)),
      // Now lets return the result (an observable of the mergmap value)
      map(product => new ProductLoaded({product})),
  );

  constructor(
    private actions$: Actions,
    private productService: ProductService,
    ) {}

}

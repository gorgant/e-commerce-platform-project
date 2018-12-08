import { Injectable } from '@angular/core';
import { Product } from '../../models/product';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap, filter, first } from 'rxjs/operators';
import { RootStoreState, ProductsStoreSelectors, ProductsStoreActions } from 'src/app/root-store';

@Injectable()
export class ProductSingleResolver implements Resolve<Product> {
  constructor(
    private store$: Store<RootStoreState.State>
  ) {}

  // This triggers a router transition only if the operation below gets resolved
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    const productId: string = route.params['id'];

    return this.store$.select(ProductsStoreSelectors.selectProductById(productId)).pipe(
      // If product isn't available in store, fetch it from database
      tap(product => {
        if (!product) {
          this.store$.dispatch(new ProductsStoreActions.ProductRequested({productId}));
        }
      }),
      // Filter out any 'undefined' results if it's not in the store so those don't get passed to the router
      filter(product => !!product),
      // Return the first result, otherwise this router operation never resolves
      first()
    );
  }
}

import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ProductService } from './product.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { Observable } from 'rxjs';
import { selectProductById } from '../store/product.selectors';
import { tap, filter, first } from 'rxjs/operators';
import { ProductRequested } from '../store/product.actions';

@Injectable()
export class ProductResolver implements Resolve<Product> {
  constructor(
    private productService: ProductService,
    private store: Store<AppState>
  ) {}

  // This triggers a router transition only if the operation below gets resolved
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    const productId: string = route.params['id'];

    return this.store
      .pipe(
        select(selectProductById(productId)),
        // If product isn't available in store, fetch it from database
        tap(product => {
          if (!product) {
            this.store.dispatch(new ProductRequested({productId}));
          }
        }),
        // Filter out any 'undefined' results if it's not in the store so those don't get passed to the router
        filter(product => !!product),
        // Return the first result, otherwise this router operation never resolves
        first()
      );
  }
}

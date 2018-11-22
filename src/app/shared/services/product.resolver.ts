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

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> {
    const productId = route.params['id'];
    console.log('product ID', productId);

    return this.store
      .pipe(
        select(selectProductById(productId)),
        // If product isn't available in store, fetch it from database
        tap(product => {
          if (!product) {
            this.store.dispatch(new ProductRequested({productId}));
          }
        }),
        // Filter out any 'undefined' results if it's not in the store
        filter(product => !!product),
        // Return the first result, otherwise this operation never completes
        first()
      );
  }
}

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Product } from '../models/product';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { ProductService } from './product.service';
import { AllProductsRequested } from '../store/product.actions';
import { selectAllProducts } from '../store/product.selectors';
import { Observable } from 'rxjs';
import { tap, first, take, filter, every } from 'rxjs/operators';

@Injectable()
export class ProductAllResolver implements Resolve<Product[]> {
  constructor(
    private productService: ProductService,
    private store: Store<AppState>
  ) {}

  // This triggers a router transition only if the operation below gets resolved
  resolve(): Observable<Product[]> {
    console.log('All Products Resolver triggered');
    // this.store.dispatch(new AllProductsRequested());

    // return this.store
    //   .pipe(
    //     select(selectAllProducts),
    //     tap(productList => {
    //       if (productList.length < 1) {
    //         console.log('no products detected');
    //         // This populates the product list on initialization
    //         this.store.dispatch(new AllProductsRequested());
    //       }
    //     }),
    //     take(2)
    //   // Return the first result, otherwise this router operation never resolves
    // );

    this.store.dispatch(new AllProductsRequested());
    return this.store
      .pipe(
        select(selectAllProducts),
        tap(products => {
          if (!products) {
            this.store.dispatch(new AllProductsRequested());
          }
        }),
        take(2)

      );
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Product } from 'src/app/shared/models/product';
import { switchMap } from 'rxjs/operators';
import { RootStoreState, CategoriesStoreSelectors, ProductsStoreSelectors } from 'src/app/root-store';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  filteredProducts$: Observable<Product[]> = of([]);

  constructor(
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {

    // Products store already initialized in navbar
    // Set the filtered products list based on the filter value in the store (set in the product-filter component)
    this.filteredProducts$ = this.store$.select(CategoriesStoreSelectors.selectFilterCategoryValue).pipe(
      switchMap(catValue => {
        return this.store$.select(ProductsStoreSelectors.selectFilteredProducts(catValue));
      })
    );
  }
}

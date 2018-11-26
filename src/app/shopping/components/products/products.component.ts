import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { Product } from 'src/app/shared/models/product';
import { selectFilteredProducts } from 'src/app/shared/store/product.selectors';
import { selectFilterCategoryValue } from 'src/app/shared/store/category.selectors';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  filteredProducts$: Observable<Product[]> = of([]);

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    // this.authSubscription = this.authService.appUser$.subscribe( user => {
    //     this.shoppingCartService.loadCartProducts();
    //     console.log('Logged in, cart loaded');
    // });

    // Products and cart items initialized in nav bar
    // Set the filtered products list based on the filter value in the store (set in the product-filter component)
    this.filteredProducts$ = this.store.pipe(
      select(selectFilterCategoryValue),
      switchMap(catValue => {
        return this.store.pipe(select(selectFilteredProducts(catValue)));
      })
    );
  }
}

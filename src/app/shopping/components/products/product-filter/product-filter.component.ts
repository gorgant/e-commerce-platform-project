import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductCategory } from 'src/app/shared/models/product-category';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, CategoriesStoreSelectors, CategoriesStoreActions } from 'src/app/root-store';


@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit, OnDestroy {

  paramsCatId: string;

  productCategories$: Observable<ProductCategory[]>;

  queryParamSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store$: Store<RootStoreState.State>
    ) { }

  ngOnInit() {

    // Categories store already initialized in nav bar component
    // Load the product categories
    this.productCategories$ = this.store$.select(CategoriesStoreSelectors.selectAllCategories);

    // Set the active filter based on the query parameters
    this.queryParamSubscription = this.route.queryParamMap.subscribe(
      params => {
        if (params.get('categoryId')) {
          this.paramsCatId = params.get('categoryId');
        } else {
          this.paramsCatId = 'allCategories';
        }
        this.store$.dispatch(new CategoriesStoreActions.FilterCategorySelected({categoryId: this.paramsCatId}));
      }
    );
  }

  ngOnDestroy() {
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
  }
}

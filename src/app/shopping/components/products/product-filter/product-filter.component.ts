import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductCategory } from 'src/app/shared/models/product-category';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { AllCategoriesRequested, FilterCategorySelected } from 'src/app/shared/store/category.actions';
import { selectAllCategories } from 'src/app/shared/store/category.selectors';


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
    private store: Store<AppState>
    ) { }

  ngOnInit() {

    // This populates the categories list on initialization, and only updates if changes to the list
    this.store.dispatch(new AllCategoriesRequested);

    // Load the product categories
    this.productCategories$ = this.store
    .pipe(
      select(selectAllCategories)
    );

    // Set the active filter based on the query parameters
    this.queryParamSubscription = this.route.queryParamMap.subscribe(
      params => {
        if (params.get('categoryId')) {
          this.paramsCatId = params.get('categoryId');
        } else {
          this.paramsCatId = 'allCategories';
        }
        this.store.dispatch(new FilterCategorySelected({categoryId: this.paramsCatId}));
      }
    );
  }

  ngOnDestroy() {
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
  }
}

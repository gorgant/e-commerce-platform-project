import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { CategoryService } from '../services/category.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { CategoriesRequested, ProductCategoryActionTypes, CategoriesLoaded } from './product-category.actions';
import { withLatestFrom, filter, mergeMap, map } from 'rxjs/operators';
import { allProductCategoriesLoaded } from './product-category.selectors';

@Injectable()
export class ProductCategoryEffects {

  @Effect()
  loadAllProductCategories$ = this.actions$
      .pipe(
        ofType<CategoriesRequested>(ProductCategoryActionTypes.CategoriesRequested),
        // This combines the previous observable with the current one
        withLatestFrom(this.store.pipe(select(allProductCategoriesLoaded))),
        // Ingest both observable values and filter out the observable and only trigger if the
        // courses haven't been loaded (only false makes it through)
        filter(([action, allCategoriesLoadedVal]) => {
          console.log('filter engaged');
          return !allCategoriesLoadedVal;
        }
         ),
        // Call api for data
        mergeMap(action => {
          console.log('category service requested');
          return this.categoryService.refreshProductCategories();
        } ),
        // Take results and trigger an action
        map(categories => new CategoriesLoaded({categories}))
      );

  constructor(
    private actions$: Actions,
    private categoryService: CategoryService,
    private store: Store<AppState>
    ) {}

}

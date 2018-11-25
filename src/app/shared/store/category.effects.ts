import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { CategoryService } from '../services/category.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { AllCategoriesRequested, CategoryActionTypes, AllCategoriesLoaded, CategoryRequested, CategoryLoaded } from './category.actions';
import { withLatestFrom, filter, mergeMap, map } from 'rxjs/operators';
import { allCategoriesLoaded } from './category.selectors';

@Injectable()
export class CategoryEffects {

  @Effect()
  loadProduct$ = this.actions$
    .pipe(
      ofType<CategoryRequested>(CategoryActionTypes.CategoryRequested),
      // Using mergeMap instead of switchMap b/c that will ensure multiple requests can run in parallel
      mergeMap(action => this.categoryService.getSingleProductCategory(action.payload.categoryId)),
      // Now lets return the result (an observable of the mergmap value) which gets sent to the store and is saved used the reducer
      map(category => new CategoryLoaded({category: category})),
    );

  @Effect()
  loadAllProductCategories$ = this.actions$
      .pipe(
        ofType<AllCategoriesRequested>(CategoryActionTypes.AllCategoriesRequested),
        // This combines the previous observable with the current one
        withLatestFrom(this.store.pipe(select(allCategoriesLoaded))),
        // Ingest both observable values and filter out the observable and only trigger if the
        // courses haven't been loaded (only false makes it through)
        filter(([action, allCategoriesLoadedVal]) => !allCategoriesLoadedVal),
        // Call api for data
        mergeMap(action => this.categoryService.refreshProductCategories()),
        // Take results and trigger an action
        map(categories => new AllCategoriesLoaded({categories}))
      );

  constructor(
    private actions$: Actions,
    private categoryService: CategoryService,
    private store: Store<AppState>
    ) {}

}

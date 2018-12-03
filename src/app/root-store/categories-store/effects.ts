import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as featureActions from './actions';
import * as featureSelectors from './selectors';
import { mergeMap, map, withLatestFrom, filter, catchError, startWith, switchMap } from 'rxjs/operators';
import { CategoryService } from 'src/app/shared/services/category.service';
import { RootStoreState } from '..';

@Injectable()
export class CategoryStoreEffects {

  constructor(
    private actions$: Actions,
    private categoryService: CategoryService,
    private store$: Store<RootStoreState.State>
    ) {}

  @Effect()
  loadCategoryEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.CategoryRequested>(
      featureActions.ActionTypes.CATEGORY_REQUESTED
    ),
    // Using mergeMap instead of switchMap b/c that will ensure multiple requests can run in parallel
    mergeMap(action => this.categoryService.getSingleProductCategory(action.payload.categoryId).pipe(
      // Now lets return the result (an observable of the mergmap value) which gets sent to the store and is saved used the reducer
      map(category => new featureActions.CategoryLoaded({category: category})),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );

  @Effect()
  loadAllProductCategoriesEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AllCategoriesRequested>(
      featureActions.ActionTypes.ALL_CATEGORIES_REQUESTED),
    // This combines the previous observable with the current one
    withLatestFrom(this.store$.select(featureSelectors.selectCategoriesLoading)),
    // Ingest both observable values and filter out the observable and only trigger if the
    // courses haven't been loaded (only true makes it through)
    filter(([action, categoriesLoading]) => categoriesLoading),
    startWith(new featureActions.AllCategoriesRequested()),
    // Call api for data
    switchMap(action => this.categoryService.getAllProductCategories().pipe(
      // Take results and trigger an action
      map(categories => new featureActions.AllCategoriesLoaded({categories})),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );

}

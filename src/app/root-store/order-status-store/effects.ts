import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OrderStatusService } from 'src/app/shared/services/order-status.service';
import { Store, Action } from '@ngrx/store';
import { RootStoreState } from '..';
import { Observable, of } from 'rxjs';

import * as featureActions from './actions';
import * as featureSelectors from './selectors';
import { withLatestFrom, filter, startWith, switchMap, map, catchError } from 'rxjs/operators';

@Injectable()
export class OrderStatusStoreEffects {

  constructor(
    private actions$: Actions,
    private orderStatusService: OrderStatusService,
    private store$: Store<RootStoreState.State>
    ) {}

  @Effect()
  loadAllOrderStatusesEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.AllOrderStatusesRequested>(
      featureActions.ActionTypes.ALL_ORDER_STATUSES_REQUESTED),
    // This combines the previous observable with the current one
    withLatestFrom(this.store$.select(featureSelectors.selectOrderStatusesLoading)),
    // Ingest both observable values and filter out the observable and only trigger if the
    // courses haven't been loaded (only true makes it through)
    filter(([action, orderStatusesLoading]) => orderStatusesLoading),
    startWith(new featureActions.AllOrderStatusesRequested()),
    // Call api for data
    switchMap(action => this.orderStatusService.getAllOrderStatuses().pipe(
      // Take results and trigger an action
      map(orderStatuses => new featureActions.AllOrderStatusesLoaded({orderStatuses})),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );

}

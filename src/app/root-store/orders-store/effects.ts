import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OrderService } from 'src/app/shared/services/order.service';
import { Store, Action } from '@ngrx/store';
import { RootStoreState } from '..';
import { Observable, of } from 'rxjs';
import * as featureActions from './actions';
import * as featureSelectors from './selectors';
import { mergeMap, map, catchError, withLatestFrom, filter, startWith, switchMap, tap } from 'rxjs/operators';
import { Update } from '@ngrx/entity';
import { Order } from 'src/app/shared/models/order';

@Injectable()
export class OrderStoreEffects {

  constructor(
    private actions$: Actions,
    private orderService: OrderService,
    private store$: Store<RootStoreState.State>
    ) {}

  @Effect()
  loadOrderEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.OrderRequested>(
      featureActions.ActionTypes.ORDER_REQUESTED
    ),
    // Using mergeMap instead of switchMap b/c that will ensure multiple requests can run in parallel
    mergeMap(action => this.orderService.getSingleOrder(action.payload.orderId).pipe(
      // Now lets return the result (an observable of the mergmap value) which gets sent to the store and is saved used the reducer
      map(order => new featureActions.OrderLoaded({order: order})),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );

  @Effect()
  loadAllOrdersEffect$ = this.actions$.pipe(
    ofType<featureActions.AllOrdersRequested>(
      featureActions.ActionTypes.ALL_ORDERS_REQUESTED
    ),
    // This combines the previous observable with the current one
    withLatestFrom(this.store$.select(featureSelectors.selectOrdersLoading)),
    // Ingest both observable values and filter out the observable and only trigger if the
    // courses haven't been loaded (only true makes it through)
    filter(([action, ordersLoading]) => ordersLoading),
    startWith(new featureActions.AllOrdersRequested()),
    // Call api for data
    switchMap(action => {
      return this.orderService.getOrders().pipe(
        // Take results and trigger an action
        map(orders => new featureActions.AllOrdersLoaded({orders})),
        catchError(error =>
          of(new featureActions.LoadErrorDetected({ error }))
        )
      );
    }),
  );

  @Effect()
  loadCustomerOrdersEffect$ = this.actions$.pipe(
    ofType<featureActions.CustomerOrdersRequested>(
      featureActions.ActionTypes.CUSTOMER_ORDERS_REQUESTED
    ),
    // This combines the previous observable with the current one
    withLatestFrom(this.store$.select(featureSelectors.selectOrdersLoading)),
    // Ingest both observable values and filter out the observable and only trigger if the
    // courses haven't been loaded (only true makes it through)
    filter(([action, ordersLoading]) => ordersLoading),
    // startWith(new featureActions.CustomerOrdersRequested()),
    // Call api for data
    switchMap(([action, ordersLoading]) => {
      const customerId: string = action.payload.customerId;
      return this.orderService.getCustomerOrders(customerId).pipe(
        // Take results and trigger an action
        map(orders => new featureActions.CustomerOrdersLoaded({orders})),
        catchError(error =>
          of(new featureActions.LoadErrorDetected({ error }))
        )
      );
    }),
  );

  @Effect()
  updateOrderEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.UpdateOrderRequested>(
      featureActions.ActionTypes.UPDATE_ORDER_REQUESTED
    ),
    mergeMap(action => this.orderService.saveOrder(action.payload.order).pipe(
      map(order => {
        const orderUp: Update<Order> = {
          id: order.orderId,
          changes: order
        };
        return new featureActions.UpdateOrderComplete({order: orderUp});
      }),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );

  @Effect()
  addOrderEffect$ = this.actions$.pipe(
    ofType<featureActions.AddOrderRequested>(
      featureActions.ActionTypes.ADD_ORDER_REQUESTED
    ),
    mergeMap(action => this.orderService.createOrder(action.payload.order).pipe(
      map(orderWithId => new featureActions.AddOrderComplete({order: orderWithId})),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );

  @Effect()
  deleteOrderEffect$ = this.actions$.pipe(
    ofType<featureActions.DeleteOrderRequested>(
      featureActions.ActionTypes.DELETE_ORDER_REQUESTED
    ),
    mergeMap(action => this.orderService.deleteOrder(action.payload.orderId).pipe(
      map(prodId => new featureActions.DeleteOrderComplete({orderId: prodId})),
      catchError(error =>
        of(new featureActions.LoadErrorDetected({ error }))
      )
    )),
  );

}

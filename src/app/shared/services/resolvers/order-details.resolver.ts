import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Order } from '../../models/order';
import { Store } from '@ngrx/store';
import { RootStoreState, OrdersStoreSelectors, OrdersStoreActions } from 'src/app/root-store';
import { Observable } from 'rxjs';
import { tap, filter, first } from 'rxjs/operators';

@Injectable()
export class OrderDetailsResolver implements Resolve<Order> {
  constructor(
    private store$: Store<RootStoreState.State>
  ) {}

  // This triggers a router transition only if the operation below gets resolved
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order> {
    // This params name must match the name used in the route module
    const orderId: string = route.params['id'];

    return this.store$.select(OrdersStoreSelectors.selectOrderById(orderId)).pipe(
      // If order isn't available in store, fetch it from database
      tap(order => {
        if (!order) {
          this.store$.dispatch(new OrdersStoreActions.OrderRequested({orderId}));
        }
      }),
      // Filter out any 'undefined' results if it's not in the store so those don't get passed to the router
      filter(order => !!order),
      // Return the first result, otherwise this router operation never resolves
      first()
    );
  }
}

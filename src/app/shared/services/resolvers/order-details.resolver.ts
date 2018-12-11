import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Order } from '../../models/order';
import { Store } from '@ngrx/store';
import { RootStoreState, OrdersStoreSelectors, OrdersStoreActions } from 'src/app/root-store';
import { Observable } from 'rxjs';
import { first, switchMap, combineLatest, tap, filter } from 'rxjs/operators';
import { AppUser } from '../../models/app-user';
import { UserService } from '../user.service';

@Injectable()
export class OrderDetailsResolver implements Resolve<[AppUser, Order]> {

  order$: Observable<Order>;
  orderUserId: string;

  appUser$: Observable<AppUser>;

  constructor(
    private store$: Store<RootStoreState.State>,
    private userService: UserService
  ) {}

  // This triggers a router transition only if the operation below gets resolved
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[AppUser, Order]> {
    // This params name must match the name used in the route module
    const orderId: string = route.params['id'];
    console.log('Id from resolver:', orderId);

    // This is a bit odd, but first get the order to retreive the user ID to load the user,
    // then combine that with the order itself, and emit the first result
    return this.store$.select(OrdersStoreSelectors.selectOrderById(orderId)).pipe(
      // If order isn't available in store (which it isn't if site loads on this page, which causes auth to load faster than store),
      // fetch it from database
      tap(order => {
        if (!order) {
          this.store$.dispatch(new OrdersStoreActions.OrderRequested({orderId}));
        }
      }),
      // Filter out any 'undefined' results if it's not in the store so those don't get passed to the router
      filter(order => !!order),
      // Return the first result, otherwise this router operation never resolves
      first(),
      switchMap(order => {
        return this.userService.getUserById(order.userId);
      }),
      combineLatest(
        this.store$.select(OrdersStoreSelectors.selectOrderById(orderId))
      ),
      // For some reason, first() triggers this to work
      first()
  );
  }
}

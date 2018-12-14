import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './state';
import * as fromOrder from './reducer';
import { Order } from 'src/app/shared/models/order';

// This string for the selector defines the property name exposed in the Ngrx devtools, must match StoreModule.forFeature selector in module
export const selectOrdersState: MemoizedSelector<object, State>
= createFeatureSelector<State>('orders');

// These long type definitions might look confusing at first
export const selectAllOrders: (state: object) => Order[] = createSelector(
  selectOrdersState,
  fromOrder.selectAll
);

// This selector queries an NgRx entity
export const selectOrderById: (orderId: string) => MemoizedSelector<object, Order>
= (orderId: string) => createSelector(
  selectOrdersState,
  // This scans the entity array and returns the object if it is there, otherwise undefined
  ordersState => ordersState.entities[orderId]
);

export const selectOrdersLoading: MemoizedSelector<object, boolean> = createSelector(
  selectOrdersState,
  ordersState => ordersState.ordersLoading
);

// export const selectOrdersByUser: (userId: string) => MemoizedSelector<object, Order[]> = (userId: string) => createSelector(
//   selectAllOrders,
//   allOrders => allOrders.filter(order => order.userId === userId)
// );

// tslint:disable-next-line:max-line-length
// export const selectOrdersByStatus: (orderStatusId: string) => MemoizedSelector<object, Order[]> = (orderStatusId: string) => createSelector(
//   selectAllOrders,
//   allOrders => {
//     // If no category selected, return all order statuses (which is set in the admin-orders component)
//     if (orderStatusId === 'allOrderStatuses') {
//       return allOrders;
//     } else {
//       return allOrders
//         .filter(order => order.orderStatusId === orderStatusId);
//     }
//   }
// );

export const selectOrderError: MemoizedSelector<object, any> = createSelector(
  selectOrdersState,
  ordersState => ordersState.error
);

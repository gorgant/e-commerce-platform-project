import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './state';
import * as fromOrderStatus from './reducer';
import { OrderStatus } from 'src/app/shared/models/order-status';

export const selectOrderStatusState: MemoizedSelector<object, State>
= createFeatureSelector<State>('orderStatus');

export const selectAllOrderStatuses: (state: object) => OrderStatus[] = createSelector(
  selectOrderStatusState,
  fromOrderStatus.selectAll
);

export const selectOrderStatusById: (orderStatusId: string) => MemoizedSelector<object, OrderStatus>
= (orderStatusId: string) => createSelector(
  selectOrderStatusState,
  orderStatusState => orderStatusState.entities[orderStatusId]
);

export const selectOrderStatusesLoading: MemoizedSelector<object, boolean> = createSelector(
  selectOrderStatusState,
  orderStatusState => orderStatusState.orderStatusesLoading
);

export const selectFilterOrderStatusValue: MemoizedSelector<object, string> = createSelector(
  selectOrderStatusState,
  orderStatusState => orderStatusState.filterOrderStatusId
);

export const selectOrderStatusError: MemoizedSelector<object, any> = createSelector(
  selectOrderStatusState,
  orderStatusState => orderStatusState.error
);

import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { OrderStatus } from 'src/app/shared/models/order-status';

export const featureAdapter: EntityAdapter<OrderStatus> =
  createEntityAdapter<OrderStatus>(
    {
      selectId: (orderStatus: OrderStatus) => orderStatus.orderStatusId,
    }
  );

export interface State extends EntityState<OrderStatus> {
  orderStatusesLoading?: boolean;
  filterOrderStatusId: string;
  error: string;
}

export const initialState: State = featureAdapter.getInitialState(
  {
    orderStatusesLoading: false,
    filterOrderStatusId: 'allOrderStatuses',
    error: null
  }
);

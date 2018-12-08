import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { Order } from 'src/app/shared/models/order';

export const featureAdapter: EntityAdapter<Order> =
  createEntityAdapter<Order>(
    {
      selectId: (order: Order) => order.orderId,
    }
  );

export interface State extends EntityState<Order> {
  ordersLoading?: boolean;
  error: string;
}

export const initialState: State = featureAdapter.getInitialState(
  {
    ordersLoading: false,
    error: null
  }
);

import { DeliveryInfo } from './delivery-info';
import { OrderItem } from './order-item';
import { Store } from '@ngrx/store';
import { RootStoreModule } from 'src/app/root-store';

export class Order {
  orderId?: string;
  userId: string;
  orderDate: number;
  deliveryData: DeliveryInfo;
  orderStatusId: string;
  orderStatusName: string;
  orderItems: OrderItem[];

  constructor(
    init?: Partial<Order>,
    // private store$: Store<RootStoreState.State>
  ) {
    Object.assign(this, init);
  }

  get orderTotalPrice(): number {
    return this.orderItems.reduce(((valueStore, item) => valueStore + (item.orderItemQuantity * item.orderItemPrice)), 0);
  }

  get orderTotalQuantity(): number {
    return this.orderItems.reduce(((valueStore, item) => valueStore + item.orderItemQuantity), 0);
  }

  // get userName
}

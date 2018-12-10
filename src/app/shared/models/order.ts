import { DeliveryInfo } from './delivery-info';
import { OrderItem } from './order-item';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreSelectors } from 'src/app/root-store';
import { UserService } from '../services/user.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class Order {
  orderId?: string;
  userId: string;
  // This is loaded in real time in components
  userName?: string;
  orderDate: number;
  deliveryData: DeliveryInfo;
  orderStatusId: string;
  orderStatusName: string;
  orderItems: OrderItem[];

  constructor(
    init?: Partial<Order>,
    // private userService?: UserService,
  ) {
    Object.assign(this, init);
  }

  get orderTotalPrice(): number {
    return this.orderItems.reduce(((valueStore, item) => valueStore + (item.orderItemQuantity * item.orderItemPrice)), 0);
  }

  get orderTotalQuantity(): number {
    return this.orderItems.reduce(((valueStore, item) => valueStore + item.orderItemQuantity), 0);
  }
}

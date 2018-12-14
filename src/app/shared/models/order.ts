import { DeliveryInfo } from './delivery-info';
import { OrderItem } from './order-item';

export class Order {
  orderId?: string;
  userId: string;
  // This is loaded at run time in components
  userName?: string;
  orderDate: number;
  deliveryData: DeliveryInfo;
  orderStatusId: string;
  orderStatusName: string;
  orderItems: OrderItem[];

  constructor(
    init?: Partial<Order>,
  ) {
    Object.assign(this, init);
  }

  get orderTotalPrice(): number {
    console.log('Calculating total order price', this.orderId);
    return this.orderItems.reduce(((valueStore, item) => valueStore + (item.orderItemQuantity * item.orderItemPrice)), 0);
  }

  get orderTotalQuantity(): number {
    console.log('Calculating total order quantity', this.orderId);
    return this.orderItems.reduce(((valueStore, item) => valueStore + item.orderItemQuantity), 0);
  }
}

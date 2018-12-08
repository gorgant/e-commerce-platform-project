import { DeliveryInfo } from './delivery-info';
import { OrderItem } from './order-item';

export interface Order {
  orderId?: string;
  userId: string;
  orderDate: number;
  deliveryData: DeliveryInfo;
  orderStatusId: string;
  orderStatusName: string;
  orderedItems: OrderItem[];
}

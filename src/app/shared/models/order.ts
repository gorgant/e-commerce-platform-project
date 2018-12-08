import { ShoppingCartItem } from './shopping-cart-item';

export interface Order {
  orderId?: string;
  userId: string;
  date: number;
  orderStatusId: string;
  orderedItems: ShoppingCartItem[];
}

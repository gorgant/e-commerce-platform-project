import { Product } from './product';

export interface OrderItem {
  orderItemId: string;
  productId: string;
  orderItemPrice: number;
  orderItemQuantity: number;
  // This is only used in the components (not intended for database storage)
  product?: Product;
}

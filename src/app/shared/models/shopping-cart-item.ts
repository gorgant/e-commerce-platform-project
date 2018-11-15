import { Product } from './product';

export interface ShoppingCartItem {
  itemId: string;
  quantity: number;
  product?: Product;
}

import { Product } from './product';

export interface ShoppingCartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
}

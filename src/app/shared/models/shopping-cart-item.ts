import { Product } from './product';

export interface ShoppingCartItem {
  cartItemId: string;
  productId: string;
  quantity: number;
  product?: Product;
}

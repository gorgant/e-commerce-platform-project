import { Product } from './product';
import { ShoppingCartItem } from './shopping-cart-item';

export interface ShoppingCart {
  cartItems: ShoppingCartItem[];
}

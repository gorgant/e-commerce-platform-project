import { ShoppingCart } from './shopping-cart';

export interface AppUser {
  uid: string;
  email: string;
  isAdmin: boolean;
  photoURL?: string;
  displayName?: string;
  shoppingCart?: ShoppingCart;
}

import { CategoriesStoreState } from './categories-store';
import { ProductsStoreState } from './products-store';
import { ShoppingCartStoreState } from './shopping-cart-store';
import { AuthStoreState } from './auth-store';

export interface State {
  categories: CategoriesStoreState.State;
  products: ProductsStoreState.State;
  shoppingCart: ShoppingCartStoreState.State;
  auth: AuthStoreState.State;
}

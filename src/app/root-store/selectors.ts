import { MemoizedSelector, createSelector } from '@ngrx/store';
import { CategoriesStoreSelectors } from './categories-store';
import { ProductsStoreSelectors } from './products-store';
import { ShoppingCartStoreSelectors } from './shopping-cart-store';
import { AuthStoreSelectors } from './auth-store';

export const selectIsLoading: MemoizedSelector<object, boolean>
= createSelector(
  CategoriesStoreSelectors.selectCategoriesLoading,
  ProductsStoreSelectors.selectProductsLoading,
  ShoppingCartStoreSelectors.selectCartItemsLoading,
  AuthStoreSelectors.selectAuthIsLoading,
  (categoriesLoading: boolean, productsLoading: boolean, shoppingCartLoading: boolean, authLoading: boolean) => {
    return categoriesLoading || productsLoading || shoppingCartLoading || authLoading;
  }
);

export const selectError: MemoizedSelector<object, string>
= createSelector(
  CategoriesStoreSelectors.selectCategoryError,
  ProductsStoreSelectors.selectProductError,
  ShoppingCartStoreSelectors.selectShoppingCartError,
  AuthStoreSelectors.selectAuthError,
  (categoryError: string, productError: string, shoppingCartError: string, authError: string) => {
    return categoryError || productError || shoppingCartError || authError;
  }
);

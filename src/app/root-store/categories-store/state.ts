import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { ProductCategory } from 'src/app/shared/models/product-category';

export const featureAdapter: EntityAdapter<ProductCategory> =
  createEntityAdapter<ProductCategory>(
    {
      selectId: (category: ProductCategory) => category.categoryId
    }
  );

export interface State extends EntityState<ProductCategory> {
  categoriesLoading?: boolean;
  filterCategoryId: string;
  error: string;
}


export const initialState: State = featureAdapter.getInitialState(
  {
    categoriesLoading: false,
    filterCategoryId: 'allCategories',
    error: null
  }
);

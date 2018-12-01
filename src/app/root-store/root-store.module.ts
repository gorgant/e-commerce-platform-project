import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesStoreModule } from './categories-store/categories-store.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ProductsStoreModule } from './products-store';
import { ShoppingCartStoreModule } from './shopping-cart-store/shopping-cart-store.module';
import { AuthStoreModule } from './auth-store/auth-store.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CategoriesStoreModule,
    ProductsStoreModule,
    ShoppingCartStoreModule,
    AuthStoreModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
  ]
})
export class RootStoreModule { }

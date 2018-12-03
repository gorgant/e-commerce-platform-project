import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesStoreModule } from './categories-store/categories-store.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ProductsStoreModule } from './products-store';
import { ShoppingCartStoreModule } from './shopping-cart-store/shopping-cart-store.module';
import { AuthStoreModule } from './auth-store/auth-store.module';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { CustomSerializer } from '../shared/utils/utils';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthStoreModule,
    CategoriesStoreModule,
    ProductsStoreModule,
    ShoppingCartStoreModule,
    StoreModule.forRoot({}),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
  ],
})
export class RootStoreModule { }

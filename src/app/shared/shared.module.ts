import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductQuantityComponent } from './components/product-quantity/product-quantity.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ProductService } from './services/product.service';
import { ShoppingCartService } from './services/shopping-cart.service';
import { UserService } from './services/user.service';
import { EffectsModule } from '@ngrx/effects';
import { ProductEffects } from './store/product.effects';
import { StoreModule } from '@ngrx/store';
import { productsReducer } from './store/product.reducers';
import { ProductSingleResolver } from './services/product-single.resolver';
import { productCategoriesReducer } from './store/product-category.reducers';
import { ProductCategoryEffects } from './store/product-category.effects';
import { CategoryService } from './services/category.service';
import { cartItemsReducer } from './store/shopping-cart.reducers';
import { ShoppingCartEffects } from './store/shopping-cart.effects';

@NgModule({
  declarations: [
    ProductCardComponent,
    ProductQuantityComponent
  ],
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgbModule,
    ReactiveFormsModule,
    // The first argument identifies the property under which the feature state will be visible in dev tools
    StoreModule.forFeature('products', productsReducer),
    EffectsModule.forFeature([ProductEffects]),
    StoreModule.forFeature('product-categories', productCategoriesReducer),
    EffectsModule.forFeature([ProductCategoryEffects]),
    StoreModule.forFeature('cartItems', cartItemsReducer),
    EffectsModule.forFeature([ShoppingCartEffects]),
  ],
  exports: [
    ProductCardComponent,
    ProductQuantityComponent,
    CommonModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgbModule
  ],
  providers: [
    ProductService,
    ShoppingCartService,
    AuthService,
    AuthGuardService,
    UserService,
    ProductSingleResolver,
    CategoryService
  ]
})
export class SharedModule { }

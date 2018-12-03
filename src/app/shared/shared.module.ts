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
import { AuthGuardService } from './services/route-guards/auth-guard.service';
import { ProductService } from './services/product.service';
import { ShoppingCartService } from './services/shopping-cart.service';
import { UserService } from './services/user.service';
import { ProductSingleResolver } from './services/product-single.resolver';
import { CategoryService } from './services/category.service';
import { LoginGuardService } from './services/route-guards/login-guard.service';
import { AdminAuthGuardService } from './services/route-guards/admin-auth-guard.service';

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
    CategoryService,
    LoginGuardService,
    AdminAuthGuardService
  ]
})
export class SharedModule { }

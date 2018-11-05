import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { BsNavbarComponent } from './core/components/bs-navbar/bs-navbar.component';
import { HomeComponent } from './core/components/home/home.component';
import { ShoppingCartComponent } from './shopping/components/shopping-cart/shopping-cart.component';
import { CheckOutComponent } from './shopping/components/check-out/check-out.component';
import { MyOrdersComponent } from './shopping/components/my-orders/my-orders.component';
import { OrderSuccessComponent } from './shopping/components/order-success/order-success.component';
import { ProductsComponent } from './shopping/components/products/products.component';
import { ShippingFormComponent } from './shopping/components/shipping-form/shipping-form.component';
import { ShoppingCartSummaryComponent } from './shopping/components/shopping-cart-summary/shopping-cart-summary.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { LoginComponent } from './core/components/login/login.component';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import { ProductQuantityComponent } from './shared/components/product-quantity/product-quantity.component';

@NgModule({
  declarations: [
    AppComponent,
    BsNavbarComponent,
    HomeComponent,
    ShoppingCartComponent,
    CheckOutComponent,
    MyOrdersComponent,
    OrderSuccessComponent,
    ProductsComponent,
    ShippingFormComponent,
    ShoppingCartSummaryComponent,
    AdminOrdersComponent,
    AdminProductsComponent,
    ProductFormComponent,
    LoginComponent,
    ProductCardComponent,
    ProductQuantityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

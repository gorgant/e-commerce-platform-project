import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingRoutingModule } from './shopping-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProductsComponent } from './components/products/products.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { ShoppingCartSummaryComponent } from './components/shopping-cart-summary/shopping-cart-summary.component';
import { ShippingFormComponent } from './components/shipping-form/shipping-form.component';
import { ProductFilterComponent } from './components/products/product-filter/product-filter.component';
import { ViewOrderComponent } from './components/view-order/view-order.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ShoppingCartComponent,
    CheckOutComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    ProductFilterComponent,
    ShoppingCartSummaryComponent,
    ShippingFormComponent,
    ViewOrderComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ShoppingRoutingModule
  ]
})
export class ShoppingModule { }

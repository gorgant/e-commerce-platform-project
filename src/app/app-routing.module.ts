import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { ShoppingCartComponent } from './shopping/components/shopping-cart/shopping-cart.component';
import { MyOrdersComponent } from './shopping/components/my-orders/my-orders.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { ProductsComponent } from './shopping/components/products/products.component';
import { OrderSuccessComponent } from './shopping/components/order-success/order-success.component';
import { LoginComponent } from './core/components/login/login.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'products', component: ProductsComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},
  {path: 'check-out', component: ShoppingCartComponent},
  {path: 'order-success', component: OrderSuccessComponent},
  {path: 'login', component: LoginComponent},
  {path: 'my-orders', component: MyOrdersComponent},
  {path: 'admin/products', component: AdminProductsComponent},
  {path: 'admin/orders', component: AdminOrdersComponent},
  {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

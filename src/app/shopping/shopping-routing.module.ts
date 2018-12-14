import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { AuthGuardService } from '../shared/services/route-guards/auth-guard.service';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { OrderDetailsResolver } from '../shared/services/resolvers/order-details.resolver';
import { ViewOrderComponent } from './components/view-order/view-order.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent
  },
  {
    path: 'check-out',
    component: CheckOutComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'order-success/:id',
    component: OrderSuccessComponent,
    canActivate: [AuthGuardService],
    resolve: {
      orderFromResolver: OrderDetailsResolver
    }
  },
  {
    path: 'my-orders',
    component: MyOrdersComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'view-order/:id',
    component: ViewOrderComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'products',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRoutingModule { }

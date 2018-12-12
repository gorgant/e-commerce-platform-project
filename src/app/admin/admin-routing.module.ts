import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AuthGuardService } from '../shared/services/route-guards/auth-guard.service';
import { AdminAuthGuardService } from '../shared/services/route-guards/admin-auth-guard.service';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductSingleResolver } from '../shared/services/resolvers/product-single.resolver';
import { OrderFormComponent } from './components/order-form/order-form.component';

const routes: Routes = [
  {
    path: 'products/new',
    component: ProductFormComponent,
    canActivate: [AuthGuardService, AdminAuthGuardService]
  },
  {
    path: 'products/:id',
    component: ProductFormComponent,
    canActivate: [AuthGuardService, AdminAuthGuardService],
    resolve: {
      productFromResolver: ProductSingleResolver
    }
  },
  {
    path: 'products',
    component: AdminProductsComponent,
    canActivate: [AuthGuardService, AdminAuthGuardService],
  },
  {
    path: 'orders/:id',
    component: OrderFormComponent,
    canActivate: [AuthGuardService, AdminAuthGuardService],
  },
  {
    path: 'orders',
    component: AdminOrdersComponent,
    canActivate: [AuthGuardService, AdminAuthGuardService]
  },

  // {
  //   path: '/admin',
  //   redirectTo: 'products',
  //   pathMatch: 'full'
  // },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }

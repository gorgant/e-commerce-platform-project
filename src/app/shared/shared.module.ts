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
import { ProductSingleResolver } from './services/resolvers/product-single.resolver';
import { CategoryService } from './services/category.service';
import { LoginGuardService } from './services/route-guards/login-guard.service';
import { AdminAuthGuardService } from './services/route-guards/admin-auth-guard.service';
import { OrderService } from './services/order.service';
import { OrderStatusService } from './services/order-status.service';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { OrderDetailsResolver } from './services/resolvers/order-details.resolver';
import { RouterModule } from '@angular/router';
import { EditOrderDetailsDialogueComponent } from './components/edit-order-details-dialogue/edit-order-details-dialogue.component';
import { AngularMaterialModule } from './angular-material.module';

@NgModule({
  declarations: [
    ProductCardComponent,
    ProductQuantityComponent,
    OrderDetailsComponent,
    EditOrderDetailsDialogueComponent,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    ProductCardComponent,
    ProductQuantityComponent,
    OrderDetailsComponent,
    EditOrderDetailsDialogueComponent,
    CommonModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    NgbModule
  ],
  entryComponents: [
    EditOrderDetailsDialogueComponent
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
    AdminAuthGuardService,
    OrderService,
    OrderStatusService,
    OrderDetailsResolver
  ]
})
export class SharedModule { }

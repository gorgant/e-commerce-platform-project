import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { ProductsComponent } from './shopping/components/products/products.component';
import { LoginRedirectGuardService } from './shared/services/login-redirect-guard.service';

const routes: Routes = [
  {path: '', component: ProductsComponent},
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginRedirectGuardService]
  },

  // {path: '**', component: HomeComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
      )
    ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }

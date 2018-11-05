import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { ShoppingCartComponent } from './shopping/components/shopping-cart/shopping-cart.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'shopping-cart', component: ShoppingCartComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

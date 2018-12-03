import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    loadChildren: './shopping/shopping.module#ShoppingModule'
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule'
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule'
  },
  // {
  //   path: '',
  //   redirectTo: 'shopping',
  //   pathMatch: 'full'
  // },
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

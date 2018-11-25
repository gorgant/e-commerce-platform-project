import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { AllProductsRequested } from 'src/app/shared/store/product.actions';
import { Product } from 'src/app/shared/models/product';
import { selectAllProducts } from 'src/app/shared/store/product.selectors';
import { AllCartItemsRequested } from 'src/app/shared/store/shopping-cart.actions';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products$: Observable<Product[]>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    // this.authSubscription = this.authService.appUser$.subscribe( user => {
    //     this.shoppingCartService.loadCartProducts();
    //     console.log('Logged in, cart loaded');
    // });

    // The product list is required to load the cart items list
    this.store.dispatch(new AllProductsRequested());
    this.store.dispatch(new AllCartItemsRequested());
    this.products$ = this.store.pipe(select(selectAllProducts));
  }
}

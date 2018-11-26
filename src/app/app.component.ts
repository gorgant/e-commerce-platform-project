import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './reducers';
import { AllProductsRequested } from './shared/store/product.actions';
import { AllCartItemsRequested, CartQuantityRequested } from './shared/store/shopping-cart.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'organic-shop';

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    // // Initialize the product list
    // this.store.dispatch(new AllProductsRequested());
    // // Initialize the shopping cart
    // this.store.dispatch(new AllCartItemsRequested());
    // // Initialize the cart quantity
    // this.store.dispatch(new CartQuantityRequested());

  }
}

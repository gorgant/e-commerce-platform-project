import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ShoppingCartItem } from '../../models/shopping-cart-item';
import { Product } from '../../models/product';
import { Observable, pipe } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.scss']
})
export class ProductQuantityComponent implements OnInit {

  @Input('currentItem') currentItem: ShoppingCartItem;
  @Input('currentProduct') currentProduct: Product;
  currentItem$: Observable<ShoppingCartItem>;

  addToCartClicked: boolean;

  constructor(public shoppingCartService: ShoppingCartService) { }

  ngOnInit() {
    if (this.currentProduct) {
      this.shoppingCartService.initializeCart();
      this.currentItem$ = this.shoppingCartItem;
      this.currentItem$.subscribe( item => {
        if (item && item.quantity > 0) {
          console.log('initializing with quantity showing');
          this.addToCartClicked = true;
          console.log(this.addToCartClicked);
          console.log(item);
        } else {
          this.addToCartClicked = false;
        }
      });
      // This is to trigger the currentItem$ to initialize on pageload (not very elegant)
      this.currentItem$ = this.shoppingCartItem;
    }
  }

  onAdd(productId: string) {
    console.log('incrementing cart item with id', productId);
    this.shoppingCartService.addToCart(productId);
    this.addToCartClicked = true;
  }

  onSubtract(item: ShoppingCartItem) {
    console.log('Removing item with id ', item.id);
    this.shoppingCartService.removeFromCart(item);
  }

  get shoppingCartItem() {
    console.log('retrieving item info for product', this.currentProduct);
    return this.shoppingCartService.getSingleCartItem(this.currentProduct.id);
  }

}

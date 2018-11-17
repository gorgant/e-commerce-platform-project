import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ShoppingCartItem } from '../../models/shopping-cart-item';

@Component({
  selector: 'product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.scss']
})
export class ProductQuantityComponent implements OnInit {

  @Input('currentItem') currentItem: ShoppingCartItem;

  constructor(private shoppingCartService: ShoppingCartService) { }

  ngOnInit() {
  }

  onAdd(item: ShoppingCartItem) {
    console.log('Adding item with id ', item.id);
    this.shoppingCartService.addToCart(item.id);
  }

  onSubtract(item: ShoppingCartItem) {
    console.log('Removing item with id ', item.id);
    this.shoppingCartService.removeFromCart(item);
  }

}

import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';

@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  // shoppingCartItems$: Observable<ShoppingCartItem[]>;

  constructor(
    public shoppingCartService: ShoppingCartService) { }

  ngOnInit() {
    this.shoppingCartService.retrieveCartItems();
  }

}

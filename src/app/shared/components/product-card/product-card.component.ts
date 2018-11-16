import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import { FormGroup } from '@angular/forms';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input('product') product: Product;
  @Input('productForm') productForm: FormGroup;

  constructor(private shoppingCartService: ShoppingCartService) {

  }

  addToCart(prodId) {
    this.shoppingCartService.addToCart(prodId);
  }

  get title() { return this.productForm.get('title'); }
  get price() { return this.productForm.get('price'); }
  get categoryId() { return this.productForm.get('categoryId'); }
  get imageUrl() { return this.productForm.get('imageUrl'); }

}

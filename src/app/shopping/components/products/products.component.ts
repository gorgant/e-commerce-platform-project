import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { Subscription } from 'rxjs';
import { ProductCategory } from 'src/app/shared/models/product-category';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(public productService: ProductService) { }

  ngOnInit() {
    this.productService.getProducts();
  }
}

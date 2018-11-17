import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  authSubscription: Subscription;

  constructor(
    public productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.appUser$.subscribe( user => {
        this.shoppingCartService.loadCartProducts();
        console.log('Logged in, cart loaded');
    });
  }
}

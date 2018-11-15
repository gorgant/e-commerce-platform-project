import { Injectable } from '@angular/core';
import { SharedModule } from '../shared.module';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { AppUser } from '../models/app-user';
import { map, tap, switchMap } from 'rxjs/operators';
import { ShoppingCartItem } from '../models/shopping-cart-item';
import { Product } from '../models/product';
import { ProductService } from './product.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: SharedModule
})

export class ShoppingCartService {

  userDoc: AngularFirestoreDocument<AppUser>;
  user$: Observable<AppUser>;

  shoppingCart$: Observable<ShoppingCart>;
  shoppingCartItems$: Observable<ShoppingCartItem[]>;
  shoppingCartItems: ShoppingCartItem[] = [];
  shoppingCartProducts: Product[] = [];
  finalList = [];


  constructor(
    private readonly afs: AngularFirestore,
    private userService: UserService,
    private productService: ProductService,
    private authService: AuthService) { }

  retrieveCartItems() {
    this.shoppingCartItems$ = this.authService.appUser$.pipe(
      switchMap(user => {
        return user.shoppingCart.cartItems;
      }),
      map(item => {
        this.productService.getSingleProduct(item.itemId)
          .subscribe(product => {
            this.shoppingCartItems.push({
              itemId: item.itemId,
              quantity: item.quantity,
              product: product
            });
            console.log(this.shoppingCartItems);
          });
        return this.shoppingCartItems;
      })
    );

  }

}

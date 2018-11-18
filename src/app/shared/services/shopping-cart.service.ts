import { Injectable, OnDestroy } from '@angular/core';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ShoppingCartItem } from '../models/shopping-cart-item';
import { Product } from '../models/product';
import { ProductService } from './product.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AppUser } from '../models/app-user';

// Provided in shared module to prevent circular dependency
@Injectable()

export class ShoppingCartService implements OnDestroy {

  shoppingCart$: Observable<ShoppingCart>;
  shoppingCartItems: ShoppingCartItem[] = [];
  shoppingCartProducts: Product[] = [];

  private shoppingCartDoc: AngularFirestoreDocument<ShoppingCartItem>;
  singleShoppingCartItem$: Observable<ShoppingCartItem>;
  // cartItemQuantity$: Observable<number>;

  private shoppingCartCollection: AngularFirestoreCollection<ShoppingCartItem>;
  shoppingCartItems$: Observable<ShoppingCartItem[]>;
  itemQuantity$: Observable<number>;

  private productServiceSubscription: Subscription;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private userService: UserService,
    private readonly afs: AngularFirestore) { }



  initializeCart() {
    console.log('initializing cart');
    const userDoc = this.userService.userDoc;
    this.shoppingCartCollection = userDoc.collection<ShoppingCartItem>('shoppingCartCol');
    this.shoppingCartItems$ = this.shoppingCartCollection.valueChanges();
    return this.shoppingCartItems$;
  }

  loadCartProducts() {
    console.log('loading cart products');
    this.shoppingCartItems$ = this.initializeCart().pipe(
      switchMap(cartItems => {
        this.shoppingCartItems = [];
        return cartItems;
      }),
      map(item => {
        this.productServiceSubscription = this.productService.getSingleProduct(item.productId)
          .subscribe(product => {
            this.shoppingCartItems.push({
              id: item.id,
              productId: item.productId,
              quantity: item.quantity,
              product: product
            });
          });
        // this.calculateCartItemsQuantity();
        return this.shoppingCartItems;
      })
    );
  }

  getSingleCartItem(cartItemId: string) {
    this.shoppingCartDoc = this.shoppingCartCollection.doc(cartItemId);
    this.singleShoppingCartItem$ = this.shoppingCartDoc.valueChanges();
    return this.singleShoppingCartItem$;
  }

  addToCart(productId: string) {
    this.getSingleCartItem(productId).pipe(
      take(1)
      ).subscribe(cartItem => {
        // Set cartItem Id to product ID because each cart item is an individual product and this makes easier to search
        const cartItemData: ShoppingCartItem = {
          id: productId,
          productId: productId,
          quantity: 1
        };
        if (cartItem) {
          cartItemData.quantity = cartItem.quantity + 1;
        }
        this.shoppingCartCollection.doc(productId).update(cartItemData)
        .then(() => {
          console.log('Item update successful', cartItemData);
        })
        .catch((error) => {
          console.log('Item does not exist, creating new item', cartItemData);
          this.shoppingCartCollection.doc(productId).set(cartItemData);
        });
    });

  }

  removeFromCart(cartItem: ShoppingCartItem) {
    console.log('Removal request recieved');
    if (cartItem.quantity > 1) {
      const updatedItem: ShoppingCartItem = {
            id: cartItem.id,
            productId: cartItem.productId,
            quantity: cartItem.quantity - 1
          };
      this.shoppingCartCollection.doc(cartItem.id).update(updatedItem);
    } else {
      this.shoppingCartCollection.doc(cartItem.id).delete();
    }
  }

  // Removes from view, does not delete from database (used for logout)
  clearShoppingCart() {
    this.shoppingCartItems = null;
    this.shoppingCartItems$ = null;
  }

  async deleteAllCartItems() {
    console.log('alternate delete fired');
    const qry: firebase.firestore.QuerySnapshot = await this.shoppingCartCollection.ref.get();
    const batch = this.afs.firestore.batch();

    qry.forEach(doc => {
      batch.delete(doc.ref);
    });

    batch.commit();

    this.clearShoppingCart();

  }

  calculateCartItemsQuantity() {
    let qty = 0;
    this.itemQuantity$ = this.shoppingCartItems$.pipe(
      switchMap( cartItems => {
        return cartItems;
      }),
      map(item => {
        qty += item.quantity;
        return qty;
      })
    );
  }
  ngOnDestroy() {
    if (this.productServiceSubscription) {
      this.productServiceSubscription.unsubscribe();
    }
  }

}

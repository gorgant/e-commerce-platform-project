import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { map, switchMap, take, mergeMap } from 'rxjs/operators';
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

  private userDoc: AngularFirestoreDocument<AppUser>;

  // shoppingCart$: Observable<ShoppingCart>;
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



  // initializeCart() {
  //   console.log('initializing cart');
  //   const userDoc = this.userService.userDoc;
  //   this.shoppingCartCollection = userDoc.collection<ShoppingCartItem>('shoppingCartCol');
  //   this.shoppingCartItems$ = this.shoppingCartCollection.valueChanges();
  //   return this.shoppingCartItems$;
  // }

  // // Consider getting user doc from store instead of user service
  // loadCartProducts() {
  //   console.log('loading cart products');
  //   this.shoppingCartItems$ = this.initializeCart().pipe(
  //     switchMap(cartItems => {
  //       this.shoppingCartItems = [];
  //       return cartItems;
  //     }),
  //     map(item => {
  //       this.productServiceSubscription = this.productService.getSingleProduct(item.productId)
  //         .subscribe(product => {
  //           this.shoppingCartItems.push({
  //             cartItemId: item.cartItemId,
  //             productId: item.productId,
  //             quantity: item.quantity,
  //             product: product
  //           });
  //         });
  //       // this.calculateCartItemsQuantity();
  //       return this.shoppingCartItems;
  //     })
  //   );
  // }

  getSingleCartItem(cartItemId: string) {
    this.userDoc = this.userService.userDoc;
    this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
    this.shoppingCartDoc = this.shoppingCartCollection.doc(cartItemId);
    this.singleShoppingCartItem$ = this.shoppingCartDoc.valueChanges();
    return this.singleShoppingCartItem$;
  }

  getAllCartItems(): Observable<ShoppingCartItem[]> {
    this.userDoc = this.userService.userDoc;
    this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
    this.shoppingCartItems$ = this.shoppingCartCollection.valueChanges();
    return this.shoppingCartItems$.pipe(
      switchMap(cartItems => {
        this.shoppingCartItems = [];
        return cartItems;
      }),
      // Iterate through each cart item and add the actual product to it
      map(cartItem => {
        this.productServiceSubscription = this.productService.getSingleProduct(cartItem.productId)
          .subscribe(product => {
            this.shoppingCartItems.push({
              cartItemId: cartItem.cartItemId,
              productId: cartItem.productId,
              quantity: cartItem.quantity,
              product: product
            });
          });
        this.shoppingCartItems$ = of(this.shoppingCartItems);
        return this.shoppingCartItems;
      })
    );
  }

  incrementCartItem(cartItem: ShoppingCartItem) {
    this.userDoc = this.userService.userDoc;
    this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
    this.shoppingCartDoc = this.shoppingCartCollection.doc(cartItem.cartItemId);

    const updatedCartItem: ShoppingCartItem = {
      cartItemId: cartItem.cartItemId,
      productId: cartItem.productId,
      quantity: cartItem.quantity + 1,
      product: cartItem.product
    };

    this.shoppingCartDoc.update(updatedCartItem);
    console.log('Incremented quantity', updatedCartItem);

    return of(updatedCartItem);
  }

  decrementCartItem(cartItem: ShoppingCartItem) {
    this.userDoc = this.userService.userDoc;
    this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
    this.shoppingCartDoc = this.shoppingCartCollection.doc(cartItem.cartItemId);

    const updatedCartItem: ShoppingCartItem = {
      cartItemId: cartItem.cartItemId,
      productId: cartItem.productId,
      quantity: cartItem.quantity - 1,
      product: cartItem.product
    };

    this.shoppingCartDoc.update(updatedCartItem);
    console.log('Decremented quantity', updatedCartItem);

    return of(updatedCartItem);
  }

  createCartItem(product: Product) {
    this.userDoc = this.userService.userDoc;
    this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');

    const cartItem: ShoppingCartItem = {
      // Set cartItem Id to product ID because each cart item is an individual product and this makes easier to search
      cartItemId: product.productId,
      productId: product.productId,
      quantity: 1,
      product: product
    };

    this.shoppingCartCollection.doc(cartItem.cartItemId).set(cartItem);
    console.log('Created cart item', cartItem);

    return of(cartItem);
  }

  // addToCart(productId: string) {
  //   this.getSingleCartItem(productId).pipe(
  //     take(1)
  //     ).subscribe(cartItem => {
  //       // Set cartItem Id to product ID because each cart item is an individual product and this makes easier to search
  //       const cartItemData: ShoppingCartItem = {
  //         cartItemId: productId,
  //         productId: productId,
  //         quantity: 1
  //       };
  //       if (cartItem) {
  //         cartItemData.quantity = cartItem.quantity + 1;
  //       }
  //       this.shoppingCartCollection.doc(productId).update(cartItemData)
  //       .then(() => {
  //         console.log('Item update successful', cartItemData);
  //       })
  //       .catch((error) => {
  //         console.log('Item does not exist, creating new item', cartItemData);
  //         this.shoppingCartCollection.doc(productId).set(cartItemData);
  //       });
  //   });

  // }

  deleteCartItem(cartItemId: string) {
    this.userDoc = this.userService.userDoc;
    this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');

    this.shoppingCartCollection.doc(cartItemId).delete();
    console.log('Deleted cart item with ID', cartItemId);

    return of(cartItemId);
  }

  // removeFromCart(cartItem: ShoppingCartItem) {
  //   console.log('Removal request recieved');
  //   if (cartItem.quantity > 1) {
  //     const updatedItem: ShoppingCartItem = {
  //           cartItemId: cartItem.cartItemId,
  //           productId: cartItem.productId,
  //           quantity: cartItem.quantity - 1
  //         };
  //     this.shoppingCartCollection.doc(cartItem.cartItemId).update(updatedItem);
  //   } else {
  //     this.shoppingCartCollection.doc(cartItem.cartItemId).delete();
  //   }
  // }



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

  // Removes from view, does not delete from database (used for logout)
  clearShoppingCart() {
    this.shoppingCartItems = null;
    this.shoppingCartItems$ = null;
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

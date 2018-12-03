import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { ShoppingCartItem } from '../models/shopping-cart-item';
import { Product } from '../models/product';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AppUser } from '../models/app-user';
import { mergeMap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

// Provided in shared module to prevent circular dependency
@Injectable()

export class ShoppingCartService {

  private userDoc: AngularFirestoreDocument<AppUser>;

  private shoppingCartDoc: AngularFirestoreDocument<ShoppingCartItem>;
  singleShoppingCartItem$: Observable<ShoppingCartItem>;

  private shoppingCartCollection: AngularFirestoreCollection<ShoppingCartItem>;
  shoppingCartItems$: Observable<ShoppingCartItem[]>;

  loggedIn: boolean;

  constructor(
    private readonly afs: AngularFirestore,
    private authService: AuthService,
    private userService: UserService
    ) {
      // Can't use the Root Store for this because circular dependencies
      this.authService.firebaseUser$.subscribe(user => {
        if (user) {
          console.log('Cart detects user is logged in');
          this.loggedIn = true;
        } else {
          console.log('Cart detects user is logged out');
          this.loggedIn = false;
        }
      });
    }

  getAllCartItems(): Observable<ShoppingCartItem[]> {
    // Retreive cart data from database
    this.userDoc = this.userService.userDoc;
    this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
    this.shoppingCartItems$ = this.shoppingCartCollection.valueChanges();
    // Return the shopping cart items with the product inserted
    return this.shoppingCartItems$;
  }

  // Must use the firestore API for batch calls
  upsertOfflineCartItems(offlineCartItems: ShoppingCartItem[]): Observable<ShoppingCartItem[]> {
    if (this.loggedIn) {
      const batch = this.afs.firestore.batch();

      this.userDoc = this.userService.userDoc;
      this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');

      offlineCartItems.map(item => {
        const itemRef = this.shoppingCartCollection.ref.doc(item.cartItemId);
        batch.set(itemRef, item, {merge: true});
      });

      // Commit the batch to the database and return the updated cart from the database
      return from(batch.commit()).pipe(
        mergeMap(() => {
          console.log('Batched cart items uploaded to database', batch);
          return this.getAllCartItems();
        })
      );
    } else {
      console.log('Not logged in, no batch operation was run');
    }
  }

  incrementCartItem(cartItem: ShoppingCartItem) {

    const updatedCartItem: ShoppingCartItem = {
      cartItemId: cartItem.cartItemId,
      productId: cartItem.productId,
      quantity: cartItem.quantity + 1,
      product: cartItem.product
    };

    if (this.loggedIn) {
      this.userDoc = this.userService.userDoc;
      this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
      this.shoppingCartDoc = this.shoppingCartCollection.doc(cartItem.cartItemId);
      this.shoppingCartDoc.update(updatedCartItem);
    }

    console.log('Incremented quantity', updatedCartItem);
    return of(updatedCartItem);
  }

  decrementCartItem(cartItem: ShoppingCartItem) {

    const updatedCartItem: ShoppingCartItem = {
      cartItemId: cartItem.cartItemId,
      productId: cartItem.productId,
      quantity: cartItem.quantity - 1,
      product: cartItem.product
    };

    if (this.loggedIn) {
      this.userDoc = this.userService.userDoc;
      this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
      this.shoppingCartDoc = this.shoppingCartCollection.doc(cartItem.cartItemId);
      this.shoppingCartDoc.update(updatedCartItem);
    }

    console.log('Decremented quantity', updatedCartItem);
    return of(updatedCartItem);
  }

  createCartItem(product: Product) {

    const cartItem: ShoppingCartItem = {
      // Set cartItem Id to product ID because each cart item is an individual product and this makes easier to search
      cartItemId: product.productId,
      productId: product.productId,
      quantity: 1,
      product: product
    };

    if (this.loggedIn) {
      this.userDoc = this.userService.userDoc;
      this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
      this.shoppingCartCollection.doc(cartItem.cartItemId).set(cartItem);
    }

    console.log('Created cart item', cartItem);
    return of(cartItem);
  }

  deleteCartItem(cartItemId: string) {
    if (this.loggedIn) {
      this.userDoc = this.userService.userDoc;
      this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
      this.shoppingCartCollection.doc(cartItemId).delete();
    }

    console.log('Deleted cart item with ID', cartItemId);
    return of(cartItemId);
  }

  deleteAllCartItems(): Observable<void> {
    // Dump the local storage
    localStorage.removeItem('offlineCart');

    // Remove from database if logged in
    if (this.loggedIn) {
      console.log('Logged in, removing all cart items from db');
      this.userDoc = this.userService.userDoc;
      const batch = this.afs.firestore.batch();
      this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
      return from(this.shoppingCartCollection.ref.get()).pipe(
        switchMap(qry => {
          qry.forEach(doc => {
            batch.delete(doc.ref);
          });
          return batch.commit();
        }),
      );
    } else {
      console.log('Logged out, removing all cart items locally');
      return of(null);
    }
  }
}

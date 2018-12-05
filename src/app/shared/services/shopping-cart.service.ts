import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { ShoppingCartItem } from '../models/shopping-cart-item';
import { Product } from '../models/product';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AppUser } from '../models/app-user';
import { mergeMap, switchMap, map, takeUntil } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable()

export class ShoppingCartService {

  private userDoc: AngularFirestoreDocument<AppUser>;

  private shoppingCartDoc: AngularFirestoreDocument<ShoppingCartItem>;
  singleShoppingCartItem$: Observable<ShoppingCartItem>;

  private shoppingCartCollection: AngularFirestoreCollection<ShoppingCartItem>;
  shoppingCartItems$: Observable<ShoppingCartItem[]>;

  constructor(
    private readonly afs: AngularFirestore,
    private authService: AuthService,
    private userService: UserService
    ) {  }

  getAllCartItems(): Observable<ShoppingCartItem[]> {
    // Retreive cart data from database
    this.userDoc = this.userService.userDoc;
    this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
    return this.shoppingCartCollection.valueChanges().pipe(
      // If logged out, this triggers unsub of this observable
      takeUntil(this.authService.unsubTrigger$),
      map(cartItems => {
        console.log('Retrieving all cart items from db');
        return cartItems;
      })
    );
  }

  // Must use the firestore API for batch calls
  upsertOfflineCartItems(offlineCartItems: ShoppingCartItem[]): Observable<ShoppingCartItem[]> {
    if (this.authService.isLoggedIn) {
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

    if (this.authService.isLoggedIn) {
      this.userDoc = this.userService.userDoc;
      this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
      this.shoppingCartDoc = this.shoppingCartCollection.doc(cartItem.cartItemId);
      this.shoppingCartDoc.update(updatedCartItem);
      console.log('Incremented quantity in db');
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

    if (this.authService.isLoggedIn) {
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

    if (this.authService.isLoggedIn) {
      this.userDoc = this.userService.userDoc;
      this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
      this.shoppingCartCollection.doc(cartItem.cartItemId).set(cartItem);
    }

    console.log('Created cart item', cartItem);
    return of(cartItem);
  }

  deleteCartItem(cartItemId: string) {
    if (this.authService.isLoggedIn) {
      this.userDoc = this.userService.userDoc;
      this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
      this.shoppingCartCollection.doc(cartItemId).delete();
    }

    console.log('Deleted cart item with ID', cartItemId);
    return of(cartItemId);
  }

  deleteAllCartItems(): Observable<void> {
    console.log('Removing all cart items');
    // Dump the local storage
    localStorage.removeItem('offlineCart');

    // Remove from database if logged in
    if (this.authService.isLoggedIn) {
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
      return of(null);
    }
  }
}

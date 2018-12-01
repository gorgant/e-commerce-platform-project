import { Injectable } from '@angular/core';
import { Observable, of, from, defer } from 'rxjs';
import { ShoppingCartItem } from '../models/shopping-cart-item';
import { Product } from '../models/product';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AppUser } from '../models/app-user';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { selectCartItemById, selectAllCartItems } from '../store/shopping-cart.selectors';
import { withLatestFrom, merge, mergeMap, map, switchMap, tap } from 'rxjs/operators';
import { RootStoreState, ShoppingCartStoreActions } from 'src/app/root-store';

// Provided in shared module to prevent circular dependency
@Injectable()

export class ShoppingCartService {

  private userDoc: AngularFirestoreDocument<AppUser>;

  private shoppingCartDoc: AngularFirestoreDocument<ShoppingCartItem>;
  singleShoppingCartItem$: Observable<ShoppingCartItem>;

  private shoppingCartCollection: AngularFirestoreCollection<ShoppingCartItem>;
  shoppingCartItems$: Observable<ShoppingCartItem[]>;

  constructor(
    private readonly afs: AngularFirestore,
    private store: Store<AppState>,
    // private store$: Store<RootStoreState.State>
    ) { }

  // Retrieve user data from local storage
  // This is also used as a "cheap" way to determine if user is logged in (vs subscribing to store)
  fetchUserData() {
    const userData = localStorage.getItem('user');
    let user: AppUser;
    if (userData) {
      user = JSON.parse(userData);
      this.userDoc = this.afs.doc<AppUser>(`users/${user.uid}`);
      return true;
    } else {
      return false;
    }
  }

  getSingleCartItem(cartItemId: string) {

    if (this.fetchUserData()) {
      this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
      this.shoppingCartDoc = this.shoppingCartCollection.doc(cartItemId);
      this.singleShoppingCartItem$ = this.shoppingCartDoc.valueChanges();
      return this.singleShoppingCartItem$;
    } else {
      return this.store.pipe(select(selectCartItemById(cartItemId)));
    }
  }

  getAllCartItems(): Observable<ShoppingCartItem[]> {
    if (this.fetchUserData()) {
      // Retreive cart data from database
      this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
      this.shoppingCartItems$ = this.shoppingCartCollection.valueChanges();
      // Return the shopping cart items with the product inserted
      return this.shoppingCartItems$;
    }
  }

  // upsertOfflineCartItems(cartItems: ShoppingCartItem[]) {
  //   if (this.fetchUserData()) {
  //     this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
  //     cartItems.map(item => {
  //       this.shoppingCartDoc = this.shoppingCartCollection.doc(item.cartItemId);
  //       this.shoppingCartDoc.set(item, {merge: true});
  //     });
  //   }
  // }

  // Must use the firestore API for batch calls
  batchedUpsertOfflineCartItems(offlineCartItems: ShoppingCartItem[]): Observable<ShoppingCartItem[]> {
    if (this.fetchUserData()) {
      const batch = this.afs.firestore.batch();
      // const user: AppUser = JSON.parse(localStorage.getItem('user'));
      // const userRef = this.afs.firestore.doc(user.uid);
      // const shoppingCartCol = userRef.collection('shoppingCartCol');

      this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');

      offlineCartItems.map(item => {
        // const itemRef = shoppingCartCol.doc(item.cartItemId);
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

    if (this.fetchUserData()) {
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

    if (this.fetchUserData()) {
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

    if (this.fetchUserData()) {
      this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
      this.shoppingCartCollection.doc(cartItem.cartItemId).set(cartItem);
    }

    console.log('Created cart item', cartItem);
    return of(cartItem);
  }

  deleteCartItem(cartItemId: string) {
    if (this.fetchUserData()) {
      this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
      this.shoppingCartCollection.doc(cartItemId).delete();
    }

    console.log('Deleted cart item with ID', cartItemId);
    return of(cartItemId);
  }

  // async deleteAllCartItems() {
  //   if (this.fetchUserData()) {
  //     const qry: firebase.firestore.QuerySnapshot = await this.shoppingCartCollection.ref.get();
  //     const batch = this.afs.firestore.batch();

  //     qry.forEach(doc => {
  //       batch.delete(doc.ref);
  //     });

  //     batch.commit();
  //     console.log('Cart emptied');
  //   }
  // }

  altDeleteAllCartItems(): Observable<void> {
    if (this.fetchUserData()) {
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
    }
  }
}

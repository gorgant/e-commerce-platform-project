import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ShoppingCartItem } from '../models/shopping-cart-item';
import { Product } from '../models/product';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AppUser } from '../models/app-user';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { selectCartItemById, selectAllCartItems } from '../store/shopping-cart.selectors';
import { withLatestFrom } from 'rxjs/operators';

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
    private store: Store<AppState>
    ) { }

  // Retrieve user data from local storage
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
      this.fetchUserData();
      // Retreive cart data from database
      this.shoppingCartCollection = this.userDoc.collection<ShoppingCartItem>('shoppingCartCol');
      this.shoppingCartItems$ = this.shoppingCartCollection.valueChanges();
      // Return the shopping cart items with the product inserted
      return this.shoppingCartItems$;
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

  async deleteAllCartItems() {
    if (this.fetchUserData()) {
      const qry: firebase.firestore.QuerySnapshot = await this.shoppingCartCollection.ref.get();
      const batch = this.afs.firestore.batch();

      qry.forEach(doc => {
        batch.delete(doc.ref);
      });

      batch.commit();
      console.log('Cart emptied');
    }
  }
}

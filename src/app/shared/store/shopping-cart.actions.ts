import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { ShoppingCartItem } from '../models/shopping-cart-item';
import { Product } from '../models/product';


export enum CartActionTypes {
  CartItemRequested = '[Product Card] Cart Item Requested',
  CartItemLoaded = '[Shopping Cart API] Cart Item Loaded',
  AllCartItemsRequested = '[Cart or Product Page] All Cart Items Requsted',
  AllCartItemsLoaded = '[Shopping Cart API] All Cart Items Loaded',
  IncrementCartItemRequested = '[Quantity Component] Increment Cart Item Requested',
  IncrementCartItemComplete = '[Shopping Cart API] Cart Item Incremented',
  DecrementCartItemRequested = '[Quantity Component] Decrement Cart Item Requested',
  DecrementCartItemComplete = '[Shopping Cart API] Cart Item Decremented',
  AddCartItemRequested = '[Product Card] Add Cart Item Requested',
  AddCartItemComplete = '[Shopping Cart API] Cart Item Added',
  DeleteCartItemRequested = '[Product Card] Delete Cart Item Requested',
  DeleteCartItemComplete = '[Shopping Cart API] Cart Item Deleted',
  EmptyCartRequested = '[Cart Page] Empty Cart Requested',
  EmptyCartComplete = '[Shopping Cart API] Cart Emptied',
  CartQuantityRequested = '[Nav Bar] Cart Quantity Requested',
  CartQuantitySet = '[Shopping Cart Selector] Cart Quantity Set',
}

export class CartItemRequested implements Action {
  readonly type = CartActionTypes.CartItemRequested;

  constructor(public payload: {cartItemId: string}) {}
}

export class CartItemLoaded implements Action {
  readonly type = CartActionTypes.CartItemLoaded;

  constructor(public payload: {cartItem: ShoppingCartItem}) {}
}

export class AllCartItemsRequested implements Action {
  readonly type = CartActionTypes.AllCartItemsRequested;
}

export class AllCartItemsLoaded implements Action {
  readonly type = CartActionTypes.AllCartItemsLoaded;

  constructor(public payload: {cartItems: ShoppingCartItem[]}) {}
}

export class IncrementCartItemRequested implements Action {
  readonly type = CartActionTypes.IncrementCartItemRequested;

  constructor(public payload: {cartItem: ShoppingCartItem}) { }
}

export class IncrementCartItemComplete implements Action {
  readonly type = CartActionTypes.IncrementCartItemComplete;

  constructor(public payload: {cartItem: Update<ShoppingCartItem>}) {}
}

export class DecrementCartItemRequested implements Action {
  readonly type = CartActionTypes.DecrementCartItemRequested;

  constructor(public payload: {cartItem: ShoppingCartItem}) { }
}

export class DecrementCartItemComplete implements Action {
  readonly type = CartActionTypes.DecrementCartItemComplete;

  constructor(public payload: {cartItem: Update<ShoppingCartItem>}) {}
}

export class AddCartItemRequested implements Action {
  readonly type = CartActionTypes.AddCartItemRequested;

  constructor(public payload: {product: Product}) {}
}

export class AddCartItemComplete implements Action {
  readonly type = CartActionTypes.AddCartItemComplete;

  constructor(public payload: {cartItem: ShoppingCartItem}) {}
}

export class DeleteCartItemRequested implements Action {
  readonly type = CartActionTypes.DeleteCartItemRequested;

  constructor(public payload: {cartItemId: string}) {}
}

export class DeleteCartItemComplete implements Action {
  readonly type = CartActionTypes.DeleteCartItemComplete;

  constructor(public payload: {cartItemId: string}) {}
}

export class EmptyCartRequested implements Action {
  readonly type = CartActionTypes.EmptyCartRequested;
}

export class EmptyCartComplete implements Action {
  readonly type = CartActionTypes.EmptyCartComplete;
}

export class CartQuantityRequested implements Action {
  readonly type = CartActionTypes.CartQuantityRequested;
}

export class CartQuantitySet implements Action {
  readonly type = CartActionTypes.CartQuantitySet;

  constructor (public payload: {cartItemQuantity: number}) {}
}

export type CartItemActions =
  AllCartItemsRequested |
  AllCartItemsLoaded |
  CartItemRequested |
  CartItemLoaded |
  IncrementCartItemRequested |
  IncrementCartItemComplete |
  DecrementCartItemRequested |
  DecrementCartItemComplete |
  AddCartItemRequested |
  AddCartItemComplete |
  DeleteCartItemRequested |
  DeleteCartItemComplete |
  EmptyCartRequested |
  EmptyCartComplete |
  CartQuantityRequested |
  CartQuantitySet;

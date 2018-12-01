import { Action } from '@ngrx/store';
import { ShoppingCartItem } from 'src/app/shared/models/shopping-cart-item';
import { Update } from '@ngrx/entity';
import { Product } from 'src/app/shared/models/product';

export enum ActionTypes {
  CART_ITEM_REQUESTED = '[Product Card] Cart Item Requested',
  CART_ITEM_LOADED = '[Shopping Cart API] Cart Item Loaded',
  ALL_CART_ITEMS_REQUESTED = '[Nav Bar] All Cart Items Requsted',
  ALL_CART_ITEMS_LOADED = '[Shopping Cart API] All Cart Items Loaded',
  UPDATE_CART_ITEM_PRODUCT_COMPLETE = '[Shopping Cart Effects] Updated Cart Item Product',
  INCREMENT_CART_ITEM_REQUESTED = '[Quantity Component] Increment Cart Item Requested',
  INCREMENT_CART_ITEM_COMPLETE = '[Shopping Cart API] Cart Item Incremented',
  DECREMENT_CART_ITEM_REQUESTED = '[Quantity Component] Decrement Cart Item Requested',
  DECREMENT_CART_ITEM_COMPLETE = '[Shopping Cart API] Cart Item Decremented',
  ADD_CART_ITEM_REQUESTED = '[Product Card] Add Cart Item Requested',
  ADD_CART_ITEM_COMPLETE = '[Shopping Cart API] Cart Item Added',
  DELETE_CART_ITEM_REQUESTED = '[Product Card] Delete Cart Item Requested',
  DELETE_CART_ITEM_COMPLETE = '[Shopping Cart API] Cart Item Deleted',
  EMPTY_CART_REQUESTED = '[Cart Page] Empty Cart Requested',
  EMPTY_CART_COMPLETE = '[Shopping Cart API] Cart Emptied',
  CART_QUANTITY_REQUESTED = '[Nav Bar] Cart Quantity Requested',
  CART_QUANTITY_SET = '[Shopping Cart Effects] Cart Quantity Set',
  CART_TOTAL_PRICE_REQUESTED = '[Nav Bar] Cart Total Price Requested',
  CART_TOTAL_PRICE_SET = '[Shopping Cart Effects] Cart Total Price Set',
  // UPSERT_OFFLINE_CART_ITEMS_COMPLETE = '[Navbar] Offline Items Upserted',
  LOAD_ERROR_DETECTED = '[Shopoping Cart API] Error loading'
}

export class CartItemRequested implements Action {
  readonly type = ActionTypes.CART_ITEM_REQUESTED;

  constructor(public payload: {cartItemId: string}) {}
}

export class CartItemLoaded implements Action {
  readonly type = ActionTypes.CART_ITEM_LOADED;

  constructor(public payload: {cartItem: ShoppingCartItem}) {}
}

export class AllCartItemsRequested implements Action {
  readonly type = ActionTypes.ALL_CART_ITEMS_REQUESTED;
}

export class AllCartItemsLoaded implements Action {
  readonly type = ActionTypes.ALL_CART_ITEMS_LOADED;

  constructor(public payload: {cartItems: ShoppingCartItem[]}) {}
}

export class UpdateCartItemProductComplete implements Action {
  readonly type = ActionTypes.UPDATE_CART_ITEM_PRODUCT_COMPLETE;

  constructor(public payload: {cartItem: Update<ShoppingCartItem>}) {}
}

export class IncrementCartItemRequested implements Action {
  readonly type = ActionTypes.INCREMENT_CART_ITEM_REQUESTED;

  constructor(public payload: {cartItem: ShoppingCartItem}) { }
}

export class IncrementCartItemComplete implements Action {
  readonly type = ActionTypes.INCREMENT_CART_ITEM_COMPLETE;

  constructor(public payload: {cartItem: Update<ShoppingCartItem>}) {}
}

export class DecrementCartItemRequested implements Action {
  readonly type = ActionTypes.DECREMENT_CART_ITEM_REQUESTED;

  constructor(public payload: {cartItem: ShoppingCartItem}) { }
}

export class DecrementCartItemComplete implements Action {
  readonly type = ActionTypes.DECREMENT_CART_ITEM_COMPLETE;

  constructor(public payload: {cartItem: Update<ShoppingCartItem>}) {}
}

export class AddCartItemRequested implements Action {
  readonly type = ActionTypes.ADD_CART_ITEM_REQUESTED;

  constructor(public payload: {product: Product}) {}
}

export class AddCartItemComplete implements Action {
  readonly type = ActionTypes.ADD_CART_ITEM_COMPLETE;

  constructor(public payload: {cartItem: ShoppingCartItem}) {}
}

export class DeleteCartItemRequested implements Action {
  readonly type = ActionTypes.DELETE_CART_ITEM_REQUESTED;

  constructor(public payload: {cartItemId: string}) {}
}

export class DeleteCartItemComplete implements Action {
  readonly type = ActionTypes.DELETE_CART_ITEM_COMPLETE;

  constructor(public payload: {cartItemId: string}) {}
}

export class EmptyCartRequested implements Action {
  readonly type = ActionTypes.EMPTY_CART_REQUESTED;
}

export class EmptyCartComplete implements Action {
  readonly type = ActionTypes.EMPTY_CART_COMPLETE;
}

export class CartQuantityRequested implements Action {
  readonly type = ActionTypes.CART_QUANTITY_REQUESTED;
}

export class CartTotalPriceRequested implements Action {
  readonly type = ActionTypes.CART_TOTAL_PRICE_REQUESTED;
}

export class CartQuantitySet implements Action {
  readonly type = ActionTypes.CART_QUANTITY_SET;

  constructor (public payload: {cartItemQuantity: number}) {}
}

export class CartTotalPriceSet implements Action {
  readonly type = ActionTypes.CART_TOTAL_PRICE_SET;

  constructor (public payload: {cartTotalPrice: number}) {}
}

// export class UpsertOfflineCartItemsComplete implements Action {
//   readonly type = ActionTypes.UPSERT_OFFLINE_CART_ITEMS_COMPLETE;

//   constructor (public payload: {offlineCartItems: ShoppingCartItem[]}) {}
// }

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.LOAD_ERROR_DETECTED;

  constructor(public payload: {error: string}) {}
}

export type Actions =
  AllCartItemsRequested |
  AllCartItemsLoaded |
  CartItemRequested |
  CartItemLoaded |
  UpdateCartItemProductComplete |
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
  CartQuantitySet |
  CartTotalPriceRequested |
  CartTotalPriceSet |
  // UpsertOfflineCartItemsComplete |
  LoadErrorDetected;

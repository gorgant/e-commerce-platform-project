import { Action } from '@ngrx/store';
import { Order } from 'src/app/shared/models/order';
import { Update } from '@ngrx/entity';

export enum ActionTypes {
  ORDER_REQUESTED = '[Orders Page] Order Requested',
  ORDER_LOADED = '[Order API] Order Loaded',
  ALL_ORDERS_REQUESTED = '[Orders Page] All Orders Requested',
  ALL_ORDERS_LOADED = '[Order API] All Orders Loaded',
  CUSTOMER_ORDERS_REQUESTED = '[My Orders] Customer Orders Requested',
  CUSTOMER_ORDERS_LOADED = '[Order API] Customer Orders Loaded',
  UPDATE_ORDER_REQUESTED = '[Admin Orders] Order Update Requested',
  UPDATE_ORDER_COMPLETE = '[Orders API] Order Updated',
  LOAD_ERROR_DETECTED = '[Orders API] Error loading',
  ADD_ORDER_REQUESTED = '[Checkout] Save Order Requested',
  ADD_ORDER_COMPLETE = '[Orders API] Order Saved',
  DELETE_ORDER_REQUESTED = '[Admin Orders] Order Delete Requested ',
  DELETE_ORDER_COMPLETE = '[Orders API] Order Deleted',
}

export class OrderRequested implements Action {
  readonly type = ActionTypes.ORDER_REQUESTED;

  constructor(public payload: {orderId: string}) {}
}

export class OrderLoaded implements Action {
  readonly type = ActionTypes.ORDER_LOADED;

  constructor(public payload: {order: Order}) {}
}

export class AllOrdersRequested implements Action {
  readonly type = ActionTypes.ALL_ORDERS_REQUESTED;
}

export class AllOrdersLoaded implements Action {
  readonly type = ActionTypes.ALL_ORDERS_LOADED;

  constructor(public payload: {orders: Order[]}) {}
}

export class CustomerOrdersRequested implements Action {
  readonly type = ActionTypes.CUSTOMER_ORDERS_REQUESTED;

  constructor(public payload: {customerId: string}) {}
}

export class CustomerOrdersLoaded implements Action {
  readonly type = ActionTypes.CUSTOMER_ORDERS_LOADED;

  constructor(public payload: {orders: Order[]}) {}
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.LOAD_ERROR_DETECTED;

  constructor(public payload: {error: string}) {}
}

export class UpdateOrderRequested implements Action {
  readonly type = ActionTypes.UPDATE_ORDER_REQUESTED;

  constructor(public payload: {order: Order}) {}
}

export class UpdateOrderComplete implements Action {
  readonly type = ActionTypes.UPDATE_ORDER_COMPLETE;

  constructor(public payload: {order: Update<Order>}) {}
}

export class AddOrderRequested implements Action {
  readonly type = ActionTypes.ADD_ORDER_REQUESTED;

  constructor(public payload: {order: Order}) {}
}

export class AddOrderComplete implements Action {
  readonly type = ActionTypes.ADD_ORDER_COMPLETE;

  constructor(public payload: {order: Order}) {}
}

export class DeleteOrderRequested implements Action {
  readonly type = ActionTypes.DELETE_ORDER_REQUESTED;

  constructor(public payload: {orderId: string}) {}
}

export class DeleteOrderComplete implements Action {
  readonly type = ActionTypes.DELETE_ORDER_COMPLETE;

  constructor(public payload: {orderId: string}) {}
}

export type Actions =
  OrderRequested |
  OrderLoaded |
  AllOrdersRequested |
  AllOrdersLoaded |
  CustomerOrdersRequested |
  CustomerOrdersLoaded |
  LoadErrorDetected |
  UpdateOrderRequested |
  UpdateOrderComplete |
  AddOrderRequested |
  AddOrderComplete |
  DeleteOrderRequested |
  DeleteOrderComplete;



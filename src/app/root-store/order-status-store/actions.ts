import { Action } from '@ngrx/store';
import { OrderStatus } from 'src/app/shared/models/order-status';

export enum ActionTypes {
  ALL_ORDER_STATUSES_REQUESTED = '[Nav Bar] All Order Statuses Requested',
  ALL_ORDER_STATUSES_LOADED = '[Order Status API] All Order Statuses Loaded',
  LOAD_ERROR_DETECTED = '[Order Status API] Error Loading Order Statuses',
  ORDER_STATUS_SELECTED = '[Status Selector] Order Status Selected'
}

export class AllOrderStatusesRequested implements Action {
  readonly type = ActionTypes.ALL_ORDER_STATUSES_REQUESTED;
}

export class AllOrderStatusesLoaded implements Action {
  readonly type = ActionTypes.ALL_ORDER_STATUSES_LOADED;

  constructor(public payload: {orderStatuses: OrderStatus[]}) { }
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.LOAD_ERROR_DETECTED;

  constructor(public payload: {error: string}) {}
}

export class OrderStatusSelected implements Action {
  readonly type = ActionTypes.ORDER_STATUS_SELECTED;

  constructor(public payload: {orderStatusId: string}) { }
}

export type Actions =
AllOrderStatusesRequested |
AllOrderStatusesLoaded |
LoadErrorDetected |
OrderStatusSelected;

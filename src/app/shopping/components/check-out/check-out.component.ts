import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  RootStoreState,
  AuthStoreSelectors,
  ShoppingCartStoreSelectors,
  OrdersStoreActions,
  OrderStatusStoreSelectors,
  OrdersStoreSelectors
} from 'src/app/root-store';
import { Observable, combineLatest } from 'rxjs';
import { DeliveryInfo } from 'src/app/shared/models/delivery-info';
import { Order } from 'src/app/shared/models/order';
import { AppUser } from 'src/app/shared/models/app-user';
import { take } from 'rxjs/operators';
import { ShoppingCartItem } from 'src/app/shared/models/shopping-cart-item';
import { OrderStatus } from 'src/app/shared/models/order-status';
import { OrderService } from 'src/app/shared/services/order.service';
import { OrderItem } from 'src/app/shared/models/order-item';
import { EmptyCartRequested } from 'src/app/root-store/shopping-cart-store/actions';

@Component({
  selector: 'check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {

  appUser$: Observable<AppUser>;

  shoppingCartItems$: Observable<ShoppingCartItem[]>;

  openOrderName$: Observable<OrderStatus>;

  checkoutForm: FormGroup;

  OPEN_ORDER_STATUS_ID = 'dJWqocoLTKoZgKNDUCRn';


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store$: Store<RootStoreState.State>,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.appUser$ = this.store$.select(
      AuthStoreSelectors.selectAppUser
    );

    this.shoppingCartItems$ = this.store$.select(
      ShoppingCartStoreSelectors.selectAllCartItems
    );

    this.openOrderName$ = this.store$.select(
      OrderStatusStoreSelectors.selectOrderStatusById(this.OPEN_ORDER_STATUS_ID)
    );


    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
    });
  }


  onSubmit() {
    const deliveryInfo: DeliveryInfo = this.checkoutForm.value;
    const orderId = this.orderService.generateOrderId();

    const requiredOrderData$ = combineLatest(this.appUser$, this.shoppingCartItems$, this.openOrderName$);

    // Take a snapshot of the combined observables
    requiredOrderData$.pipe(take(1)).subscribe(([appUser, shoppingCartItems, openOrderName]) => {

      // Create the array of ordered items from the shopping cart items
      const orderedItems: OrderItem[] = shoppingCartItems.map(item => {
        const orderItemId = this.orderService.generateOrderId();
        const orderItem: OrderItem = {
          orderItemId: orderItemId,
          productId: item.productId,
          orderItemPrice: item.product.price,
          orderItemQuantity: item.quantity
        };
        return orderItem;
      });

      const totalOrderPrice = orderedItems.reduce(((valueStore, item) => valueStore + (item.orderItemQuantity * item.orderItemPrice)), 0);
      const totalOrderQuantity = orderedItems.reduce(((valueStore, item) => valueStore + item.orderItemQuantity), 0);

      const order: Order = {
        orderId: orderId,
        userId: appUser.uid,
        orderDate: Date.now(),
        deliveryData: deliveryInfo,
        orderStatusId: this.OPEN_ORDER_STATUS_ID,
        orderStatusName: openOrderName.orderStatusName,
        orderedItems: orderedItems,
        orderTotalPrice: totalOrderPrice,
        orderTotalQuantity: totalOrderQuantity,
      };
      this.store$.dispatch(new OrdersStoreActions.AddOrderRequested({order}));
      console.log('Form submitted', order);
      this.store$.dispatch(new EmptyCartRequested());
      this.router.navigate(['../order-success', orderId], { relativeTo: this.route });
    });
  }

  // These getters are used for easy access in the HTML template
  get name() { return this.checkoutForm.get('name'); }
  get address1() { return this.checkoutForm.get('address1'); }
  get address2() { return this.checkoutForm.get('address2'); }
  get city() { return this.checkoutForm.get('city'); }

}

import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppUser } from '../../models/app-user';
import { Store } from '@ngrx/store';
import {
  RootStoreState,
  OrderStatusStoreSelectors,
  OrdersStoreActions,
  OrdersStoreSelectors
} from 'src/app/root-store';
import { ShoppingCartItem } from '../../models/shopping-cart-item';
import { OrderStatus } from '../../models/order-status';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { DeliveryInfo } from '../../models/delivery-info';
import { take } from 'rxjs/operators';
import { Order } from '../../models/order';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'edit-order-details-dialogue',
  templateUrl: './edit-order-details-dialogue.component.html',
  styleUrls: ['./edit-order-details-dialogue.component.scss']
})
export class EditOrderDetailsDialogueComponent implements OnInit, OnDestroy {

  // appUser$: Observable<AppUser>;

  // shoppingCartItems$: Observable<ShoppingCartItem[]>;

  // openOrderName$: Observable<OrderStatus>;

  orderDetailsForm: FormGroup;
  orderStatuses$: Observable<OrderStatus[]>;

  orderSubscription: Subscription;
  statusSubscription: Subscription;
  formSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store$: Store<RootStoreState.State>,
    private orderService: OrderService,
    private dialogRef: MatDialogRef<EditOrderDetailsDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) private order: Order,
  ) { }

  ngOnInit() {

    this.orderDetailsForm = this.fb.group({
      name: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      orderStatusId: [''],
      orderStatusName: ['']
    });

    this.orderStatuses$ = this.store$.select(OrderStatusStoreSelectors.selectAllOrderStatuses);

    this.orderSubscription = this.store$.select(OrdersStoreSelectors.selectOrderById(this.order.orderId))
      // .pipe(take(1))
      .subscribe(order => {
        this.orderDetailsForm.patchValue({
          name: order.deliveryData.name,
          address1: order.deliveryData.address1,
          address2: order.deliveryData.address2,
          city: order.deliveryData.city,
          orderStatusId: order.orderStatusId,
          orderStatusName: order.orderStatusName
        });
      });

    this.formSubscription = this.orderDetailsForm.get('orderStatusId').valueChanges.subscribe(value => {
      console.log('Set order status triggered');
      this.statusSubscription = this.store$.select(OrderStatusStoreSelectors.selectOrderStatusById(value))
        // .pipe(take(1))
        .subscribe(orderStatus => {
          console.log('Patching order status to this value', orderStatus);
          this.orderDetailsForm.patchValue({
            orderStatusName: orderStatus.orderStatusName
          });
        });
      });
  }


  save() {
    const deliveryInfo: DeliveryInfo = this.orderDetailsForm.value;

    // Create the order to dispatch to store and database
    const updatedOrder: Order = new Order({
      orderId: this.order.orderId,
      userId: this.order.userId,
      orderDate: this.order.orderDate,
      deliveryData: deliveryInfo,
      orderStatusId: this.orderDetailsForm.get('orderStatusId').value,
      orderStatusName: this.orderDetailsForm.get('orderStatusName').value,
      orderItems: this.order.orderItems,
    });
    this.store$.dispatch(new OrdersStoreActions.UpdateOrderRequested({order: updatedOrder}));
    console.log('Form submitted', updatedOrder);
    this.dialogRef.close();
  }

  // // This fires when the Category select field is changed, allowing access to the category object
  // // Without this, when saving the form, the category name will not populate on the form
  // setOrderStatus(orderStatusId: string) {
  //   console.log('Set order status triggered');
  //   this.storeSubscription = this.store$.select(OrderStatusStoreSelectors.selectOrderStatusById(orderStatusId))
  //     // .pipe(take(1))
  //     .subscribe(orderStatus => {
  //       console.log('Patching order status to this value', orderStatus);
  //       this.orderDetailsForm.patchValue({
  //         orderStatusName: orderStatus.orderStatusName
  //       });
  //     });
  // }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  // These getters are used for easy access in the HTML template
  get name() { return this.orderDetailsForm.get('name'); }
  get address1() { return this.orderDetailsForm.get('address1'); }
  get address2() { return this.orderDetailsForm.get('address2'); }
  get city() { return this.orderDetailsForm.get('city'); }

}

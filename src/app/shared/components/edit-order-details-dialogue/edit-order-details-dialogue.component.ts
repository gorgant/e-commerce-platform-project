import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  RootStoreState,
  OrderStatusStoreSelectors,
  OrdersStoreActions,
  OrdersStoreSelectors
} from 'src/app/root-store';
import { OrderStatus } from '../../models/order-status';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DeliveryInfo } from '../../models/delivery-info';
import { Order } from '../../models/order';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { take } from 'rxjs/operators';

@Component({
  selector: 'edit-order-details-dialogue',
  templateUrl: './edit-order-details-dialogue.component.html',
  styleUrls: ['./edit-order-details-dialogue.component.scss']
})
export class EditOrderDetailsDialogueComponent implements OnInit {

  orderDetailsForm: FormGroup;
  orderStatuses$: Observable<OrderStatus[]>;



  constructor(
    private fb: FormBuilder,
    private store$: Store<RootStoreState.State>,
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

    this.store$.select(OrdersStoreSelectors.selectOrderById(this.order.orderId))
      .pipe(take(1))
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

    this.orderDetailsForm.get('orderStatusId').valueChanges.subscribe(value => {
      console.log('Set order status triggered');
      this.store$.select(OrderStatusStoreSelectors.selectOrderStatusById(value))
        .pipe(take(1))
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

  close() {
    this.dialogRef.close();
  }

  // These getters are used for easy access in the HTML template
  get name() { return this.orderDetailsForm.get('name'); }
  get address1() { return this.orderDetailsForm.get('address1'); }
  get address2() { return this.orderDetailsForm.get('address2'); }
  get city() { return this.orderDetailsForm.get('city'); }

}

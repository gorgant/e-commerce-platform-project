import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { Store } from '@ngrx/store';
import { RootStoreState, ProductsStoreSelectors, AuthStoreSelectors, OrdersStoreSelectors, OrdersStoreActions } from 'src/app/root-store';
import { take, tap, map, filter, first } from 'rxjs/operators';
import { OrderItem } from '../../models/order-item';
import { ActivatedRoute } from '@angular/router';
import { AppUser } from '../../models/app-user';
import { Observable } from 'rxjs';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { EditOrderDetailsDialogueComponent } from '../edit-order-details-dialogue/edit-order-details-dialogue.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})

export class OrderDetailsComponent implements OnInit {

  appUser$: Observable<AppUser>;
  customer$: Observable<AppUser>;
  order$: Observable<Order>;

  orderAmount: number;

  constructor(
    private store$: Store<RootStoreState.State>,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private userService: UserService
  ) { }

  ngOnInit() {
    const orderId: string = this.route.snapshot.params['id'];

    // Retreive the app user from Store
    this.appUser$ = this.store$.select(
      AuthStoreSelectors.selectAppUser
    );

    // Assign order data and customer data (which relies on order data)
    this.order$ = this.store$.select(
      OrdersStoreSelectors.selectOrderById(orderId)
    ).pipe(
      tap(order => {
        if (!order) {
          this.store$.dispatch(new OrdersStoreActions.OrderRequested({orderId}));
        }
      }),
      // Filter out any 'undefined' results if it's not in the store so those don't get passed to the router
      filter(order => !!order),
      // Return the first result, otherwise this router operation never resolves
      first(),
      map(order => {
        return this.mapProductsToOrderItems(order);
      }),
      tap(order => {
        this.customer$ = this.userService.getUserById(order.userId);
        // Calculate here, if calculating in template it causes infinite loop w observable change detection
        this.orderAmount = order.orderTotalPrice;
      })
    );
  }

  private mapProductsToOrderItems(order: Order): Order {
    const itemsWithProducts: OrderItem[] = order.orderItems.map(item => {
      this.store$.select(ProductsStoreSelectors.selectProductById(item.productId))
        .pipe(take(1))
        .subscribe(extractedProduct => {
          item = {...item, product: extractedProduct};
        });
      return item;
    });
    return new Order({...order, orderItems: itemsWithProducts});
  }

  // Open a dialogue box to edit order data
  editOrder() {
    this.order$.
      pipe(take(1)).
      subscribe(order => {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '400px';

        dialogConfig.data = order;

        const dialogRef = this.dialog.open(EditOrderDetailsDialogueComponent, dialogConfig);
      });
  }

}

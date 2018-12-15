import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Order } from 'src/app/shared/models/order';
import { Store } from '@ngrx/store';
import { RootStoreState, OrdersStoreActions, OrdersStoreSelectors } from 'src/app/root-store';
import { AuthService } from 'src/app/shared/services/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['date', 'orderId', 'totalPrice',  'view'];
  dataSource: MatTableDataSource<Order>;

  fbUser$: Observable<firebase.User>;
  orders$: Observable<Order[]>;
  orderDataSubscription: Subscription;

  ordersLoading$: Observable<boolean>;

  constructor(
    private store$: Store<RootStoreState.State>,
    private authService: AuthService
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {

    // Need to user authService because Store is too slow if site loads on this page
    this.fbUser$ = this.authService.firebaseUser$;
    this.orders$ = this.store$.select(OrdersStoreSelectors.selectAllOrders);

    // Load customer specific order data into store
    this.fbUser$.pipe(
      take(1))
      .subscribe(appUser =>
        this.store$.dispatch(new OrdersStoreActions.CustomerOrdersRequested({customerId: appUser.uid}))
      );

    // Populate chart with customer orders
    this.orderDataSubscription = this.orders$.subscribe(orders => {

      this.dataSource = new MatTableDataSource(orders);
      this.dataSource.paginator = this.paginator;

      // Timeout required to ensure data is loaded before sort takes place
      setTimeout(() => {
        // Sort data
        this.dataSource.sort = this.sort;
        // Cast the date string in a date object so that it sorts properly (otherwise won't sort by date)
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'date': return new Date(item.orderDate);
            default: return item[property];
          }
        };
      });
    });

    this.ordersLoading$ = this.store$.select(OrdersStoreSelectors.selectOrdersLoading);

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  calcOrderTotalPrice(order: Order): number {
    // console.log('calculating order amount');
    return order.orderItems.reduce(((valueStore, item) => valueStore + (item.orderItemQuantity * item.orderItemPrice)), 0);
  }

  ngOnDestroy() {
    if (this.orderDataSubscription) {
      this.orderDataSubscription.unsubscribe();
    }
  }

}

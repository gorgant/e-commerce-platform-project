import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Order } from 'src/app/shared/models/order';
import { Store } from '@ngrx/store';
import { RootStoreState, OrdersStoreActions, OrdersStoreSelectors } from 'src/app/root-store';

@Component({
  selector: 'admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit, OnDestroy {

  storeSubscription: Subscription;
  displayedColumns: string[] = ['date', 'orderId', 'status',  'view'];
  dataSource: MatTableDataSource<Order>;

  ordersLoading$: Observable<boolean>;

  constructor(
    // public orderStatusImporter: OrderStatusImporter
    private store$: Store<RootStoreState.State>,
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {

    // This may be initialized elsewhere, double check
    this.store$.dispatch(new OrdersStoreActions.AllOrdersRequested);
    // Load product data into MatTable
    this.storeSubscription = this.store$.select(
      OrdersStoreSelectors.selectAllOrders
    )
    .subscribe(orders => {
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
            case 'status': return item.orderStatusName;
            default: return item[property];
          }
        };
      });
    });

    this.ordersLoading$ = this.store$.select(
      OrdersStoreSelectors.selectOrdersLoading
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }

}

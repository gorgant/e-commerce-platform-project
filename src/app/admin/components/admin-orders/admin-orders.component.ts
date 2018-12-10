import { OrderStatusImporter } from 'src/app/shared/services/importers/order-status-importer.service';
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
  displayedColumns: string[] = ['date', 'customer', 'status',  'view'];
  dataSource: MatTableDataSource<Order>;

  ordersLoading$: Observable<boolean>;

  constructor(
    // public orderStatusImporter: OrderStatusImporter
    private store$: Store<RootStoreState.State>
  ) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {

    // This may be initialized elsewhere, double check
    this.store$.dispatch(new OrdersStoreActions.AllOrdersRequested);
    // Load product data into MatTable
    this.storeSubscription = this.store$.select(
      OrdersStoreSelectors.selectAllOrders
    ).subscribe(orders => {
      this.dataSource = new MatTableDataSource(orders);
      this.dataSource.paginator = this.paginator;
      setTimeout(() => this.dataSource.sort = this.sort);
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

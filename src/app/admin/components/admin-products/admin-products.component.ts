import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Product } from 'src/app/shared/models/product';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, ProductsStoreSelectors } from 'src/app/root-store';

@Component({
  selector: 'admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  storeSubscription: Subscription;
  displayedColumns: string[] = ['itemNo', 'title', 'price', 'edit'];
  dataSource: MatTableDataSource<Product>;

  productsLoading$: Observable<boolean>;

  constructor(
    // public productImporter: ProductImporterService,
    // public categoryImporter: CategoryImporterService,
    private store$: Store<RootStoreState.State>
  ) {
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {

    // Product list initialized in nav bar
    // Load product data into MatTable
    this.storeSubscription = this.store$.select(
      ProductsStoreSelectors.selectAllProducts
    ).subscribe(products => {
      this.dataSource = new MatTableDataSource(products);
      this.dataSource.paginator = this.paginator;
      setTimeout(() => this.dataSource.sort = this.sort);
    });

    this.productsLoading$ = this.store$.select(
      ProductsStoreSelectors.selectProductsLoading
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


import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Product } from 'src/app/shared/models/product';
import { Subscription, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { selectAllProducts, selectAllProductsLoaded } from 'src/app/shared/store/product.selectors';
import { AllProductsRequested } from 'src/app/shared/store/product.actions';
import { ProductImporterService } from 'src/app/shared/services/product-importer.service';
import { CategoryImporterService } from 'src/app/shared/services/category-importer.service';

@Component({
  selector: 'admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  storeSubscription: Subscription;
  displayedColumns: string[] = ['itemNo', 'title', 'price', 'edit'];
  dataSource: MatTableDataSource<Product>;

  productsLoaded$: Observable<boolean>;

  constructor(
    // public productImporter: ProductImporterService,
    // public categoryImporter: CategoryImporterService,
    private store: Store<AppState>) {
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.store.dispatch(new AllProductsRequested());
    this.storeSubscription = this.store.pipe(select(selectAllProducts))
      .subscribe(products => {
        this.dataSource = new MatTableDataSource(products);
        this.dataSource.paginator = this.paginator;
        setTimeout(() => this.dataSource.sort = this.sort);
      });

    this.productsLoaded$ = this.store.pipe(select(selectAllProductsLoaded));
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


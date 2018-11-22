import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
// import { DataImporterService } from 'src/app/shared/services/data-importer.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Product } from 'src/app/shared/models/product';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { selectAllProducts } from 'src/app/shared/store/product.selectors';
import { AllProductsRequested } from 'src/app/shared/store/product.actions';
// import { ProductsDataSource } from 'src/app/shared/services/products.datasource';

@Component({
  selector: 'admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  storeSubscription: Subscription;
  displayedColumns: string[] = ['itemNo', 'title', 'price', 'edit'];
  dataSource: MatTableDataSource<Product>;

  constructor(
    // // Used to import products using the import service
    // public importer: DataImporterService,
    private route: ActivatedRoute,
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


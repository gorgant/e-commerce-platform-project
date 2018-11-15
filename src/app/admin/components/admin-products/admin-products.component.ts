import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { DataImporterService } from 'src/app/shared/services/data-importer.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['itemNo', 'title', 'price', 'edit'];
  dataSource: MatTableDataSource<Product>;
  data: Product[] = [];
  productSubscription: Subscription;

  constructor(
    public importer: DataImporterService,
    private productService: ProductService) {
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.initializeDataTable();
  }

  initializeDataTable() {
    this.productSubscription = this.productService.getProducts().subscribe(
      data => {
        this.data = data;
        this.dataSource = new MatTableDataSource(this.data);

        // Sort cannot be applied until table data is loaded, and for some reason also requires this timeout
        setTimeout(() => this.dataSource.sort = this.sort);

        // Pagination cannot be applied until table data is loaded
        this.dataSource.paginator = this.paginator;
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.productSubscription.unsubscribe();
  }
}


import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { DataImporterService } from 'src/app/shared/services/data-importer.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsDataSource } from 'src/app/shared/services/products.datasource';

@Component({
  selector: 'admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, AfterViewInit {

  products: Product[];
  newDataSource: ProductsDataSource;
  displayedColumns: string[] = ['itemNo', 'title', 'price', 'edit'];

  dataSource: MatTableDataSource<Product>;
  // data: Product[] = [];
  // productSubscription: Subscription;

  constructor(
    // // Used to import products using the import service
    // public importer: DataImporterService,
    // private productService: ProductService,
    private route: ActivatedRoute) {
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // ngOnInit() {
  //   this.products = this.route.snapshot.data['productsFs'];
  //   console.log(this.products);
  //   this.newDataSource = new ProductsDataSource(this.productService);
  //   this.newDataSource.loadProducts();

  //   // this.dataSource.sort = this.sort;
  //   // this.dataSource.paginator = this.paginator;
  // }

  // ngAfterViewInit() {
  // }

  ngOnInit() {
    this.products = this.route.snapshot.data['productsFs'];
    console.log(this.products);
    this.dataSource = new MatTableDataSource(this.products);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // ngOnDestroy() {
  //   this.productSubscription.unsubscribe();
  // }



  // ngOnInit() {
  //   this.initializeDataTable();
  // }

  // initializeDataTable() {
  //   this.productSubscription = this.productService.getProducts().subscribe(
  //     data => {
  //       this.data = data;
  //       this.dataSource = new MatTableDataSource(this.data);

  //       // Sort cannot be applied until table data is loaded, and for some reason also requires this timeout
  //       setTimeout(() => this.dataSource.sort = this.sort);

  //       // Pagination cannot be applied until table data is loaded
  //       this.dataSource.paginator = this.paginator;
  //     }
  //   );
  // }

  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  // ngOnDestroy() {
  //   this.productSubscription.unsubscribe();
  // }
}


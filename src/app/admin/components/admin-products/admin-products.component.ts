import { Component, OnInit, ViewChild } from '@angular/core';
import { DataImporterService } from 'src/app/shared/services/data-importer.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {

  displayedColumns: string[] = ['itemNo', 'title', 'price', 'edit'];
  dataSource: MatTableDataSource<Product>;
  data: Product[] = [];

  constructor(
    public importer: DataImporterService,
    private productService: ProductService,
    private router: Router) {
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.initializeDataTable();
  }

  initializeDataTable() {
    this.productService.getProducts().subscribe(
      data => {
        this.data = data;
        this.dataSource = new MatTableDataSource(this.data);

        // Sort cannot be applied until table data is loaded
        this.sortData();

        // Pagination cannot be applied until table data is loaded
        this.dataSource.paginator = this.paginator;
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sortData() {
    this.dataSource.sort = this.sort;
  }
}


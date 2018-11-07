import { Component, OnInit } from '@angular/core';
import { DataImporterService } from 'src/app/shared/services/data-importer.service';

@Component({
  selector: 'admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {

  constructor(public importer: DataImporterService) { }

  ngOnInit() {
  }



}

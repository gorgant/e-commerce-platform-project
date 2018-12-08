import { Component, OnInit } from '@angular/core';
import { OrderStatusImporter } from 'src/app/shared/services/importers/order-status-importer.service';

@Component({
  selector: 'admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {

  constructor(
    // public orderStatusImporter: OrderStatusImporter
  ) { }

  ngOnInit() {
  }

}

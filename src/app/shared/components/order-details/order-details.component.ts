import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { Store } from '@ngrx/store';
import { RootStoreState, ProductsStoreSelectors } from 'src/app/root-store';
import { take } from 'rxjs/operators';
import { OrderItem } from '../../models/order-item';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})

export class OrderDetailsComponent implements OnInit {

  orderWithProducts: Order;

  constructor(
    private store$: Store<RootStoreState.State>,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Get order data from OrderDetailsResolver
    const order: Order = this.route.snapshot.data['orderFromResolver'];
    const itemsWithProducts: OrderItem[] = order.orderItems.map(item => {
      this.store$.select(ProductsStoreSelectors.selectProductById(item.productId)).pipe(take(1))
        .subscribe(extractedProduct => {
          item = {...item, product: extractedProduct};
        });
      return item;
    });

    // Assign data to variable that is accessed by template
    this.orderWithProducts = new Order({...order, orderItems: itemsWithProducts});
  }

}

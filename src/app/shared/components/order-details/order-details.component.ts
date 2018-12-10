import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { Store } from '@ngrx/store';
import { RootStoreState, ProductsStoreSelectors, AuthStoreSelectors } from 'src/app/root-store';
import { take } from 'rxjs/operators';
import { OrderItem } from '../../models/order-item';
import { ActivatedRoute } from '@angular/router';
import { AppUser } from '../../models/app-user';
import { Observable } from 'rxjs';

@Component({
  selector: 'order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})

export class OrderDetailsComponent implements OnInit {

  orderWithProducts: Order;
  customerData: AppUser;
  appUser$: Observable<AppUser>;

  constructor(
    private store$: Store<RootStoreState.State>,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Retreive the app user from Store
    this.appUser$ = this.store$.select(
      AuthStoreSelectors.selectAppUser
    );

    // Get order data from OrderDetailsResolver
    console.log(this.route.snapshot.data['orderFromResolver']);

    const order: Order = this.route.snapshot.data['orderFromResolver'][1];
    this.customerData = this.route.snapshot.data['orderFromResolver'][0];

    // Populate order with latest product data
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

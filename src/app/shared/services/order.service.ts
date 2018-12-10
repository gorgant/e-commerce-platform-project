import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Order } from '../models/order';
import { Observable, of } from 'rxjs';

@Injectable()
export class OrderService {

  private orderDoc: AngularFirestoreDocument<Order>;
  singleOrder$: Observable<Order>;

  private ordersCollection: AngularFirestoreCollection<Order>;
  orders$: Observable<Order[]>;

  filteredOrderList$: Observable<Order[]>;

  constructor(private readonly afs: AngularFirestore) {
  }

  getSingleOrder(orderId: string): Observable<Order> {
    this.orderDoc = this.afs.doc<Order>(`orders/${orderId}`);
    this.singleOrder$ = this.orderDoc.valueChanges();
    return this.singleOrder$;
  }

  getOrders(): Observable<Order[]> {
    this.ordersCollection = this.afs.collection<Order>('orders');
    this.orders$ = this.ordersCollection.valueChanges();
    this.filteredOrderList$ = this.orders$;
    return this.orders$;
  }

  saveOrder(order: Order) {
    this.getSingleOrder(order.orderId);
    this.orderDoc.update(order);
    console.log('Saved order', order);
    // Convert this return to an observable to be consumed properly by the order effects service
    return of(order);
  }

  // Auto ID is set in the order submission page (using the generator below) because it's needed there for the url param
  createOrder(order: Order) {
    this.ordersCollection = this.afs.collection<Order>('orders');
    this.ordersCollection.doc(order.orderId).set(Object.assign({}, order));
    console.log('Created order', order);
    // Convert this return to an observable to be consumed properly by the order effects service
    return of(order);
  }

  deleteOrder(orderId: string) {
    this.ordersCollection = this.afs.collection<Order>('orders');
    this.ordersCollection.doc(orderId).delete();
    console.log('Deleted order with ID', orderId);
    return of(orderId);
  }

  generateOrderId(): string {
    return this.afs.createId();
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { OrderStatus } from '../models/order-status';
import { Observable } from 'rxjs';

@Injectable()
export class OrderStatusService {

  private orderStatusCollection: AngularFirestoreCollection<OrderStatus>;
  private orderStatuses$: Observable<OrderStatus[]>;

  constructor(private readonly afs: AngularFirestore) { }

  getAllOrderStatuses() {
    console.log('retrieving order statuses from DB');
    this.orderStatusCollection = this.afs.collection<OrderStatus>('orderStatus', ref => ref.orderBy('orderStatusPosition'));
    this.orderStatuses$ = this.orderStatusCollection.valueChanges();
    return this.orderStatuses$;
  }
}

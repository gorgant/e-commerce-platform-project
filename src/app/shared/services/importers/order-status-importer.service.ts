import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { SharedModule } from '../../shared.module';
import { OrderStatus } from '../../models/order-status';

@Injectable({
  providedIn: SharedModule
})
export class OrderStatusImporter {

  private dataList: OrderStatus[] = [
    {
      orderStatusName: 'Open',
      orderStatusPosition: 1
    },
    {
      orderStatusName: 'Complete',
      orderStatusPosition: 2
    },
    {
      orderStatusName: 'Problem',
      orderStatusPosition: 3
    },
    {
      orderStatusName: 'Canceled',
      orderStatusPosition: 4
    },
  ];

  private listWithIds: OrderStatus[];

  constructor(private afs: AngularFirestore) { }

  launchImport() {
    this.populateList();
    console.log('list populated', this.listWithIds);
  }

  // Batch import to database
  private populateList() {

    // Optionally add new IDs to items
    this.addIdToItems();

    const batch = this.afs.firestore.batch();
    const dataCollection = this.afs.collection<OrderStatus>('orderStatus');

    if (this.listWithIds) {
      this.listWithIds.map(item => {
        const itemRef = dataCollection.ref.doc(item.orderStatusId);
        batch.set(itemRef, item, {merge: true});
      });
    } else {
      this.dataList.map(item => {
        const itemRef = dataCollection.ref.doc(item.orderStatusId);
        batch.set(itemRef, item, {merge: true});
      });
      this.listWithIds = this.dataList;
    }

    batch.commit();
  }

  // Assign atuo ids to list items
  private addIdToItems(): void {
    this.listWithIds = this.dataList.map(item => {
      const autoId = this.afs.createId();
      const itemWithId: OrderStatus = {
        orderStatusId: autoId,
        orderStatusName: item.orderStatusName,
        orderStatusPosition: item.orderStatusPosition
      };
      return itemWithId;
    });
  }
}


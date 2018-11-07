import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { SharedModule } from '../shared.module';
import { ProductCategory } from '../models/product-category';

@Injectable({
  providedIn: SharedModule
})
export class DataImporterService {

  private dataCollection: AngularFirestoreCollection<ProductCategory>;
  private itemList: ProductCategory[] = [
    {
      id: null,
      name: 'Bread'
    },
    {
      id: null,
      name: 'Dairy'
    },
    {
      id: null,
      name: 'Fruits'
    },
    {
      id: null,
      name: 'Seasonings and Spices'
    },
    {
      id: null,
      name: 'Vegetables'
    },
   ];

  constructor(private afs: AngularFirestore) {
    this.dataCollection = afs.collection<ProductCategory>('categories');

  }

  launchImport() {
    this.populateList(this.itemList);
    console.log('list populated');
  }

  private addItem(item: ProductCategory) {
    const autoId = this.afs.createId();
    const thisItem = {
      id: autoId,
      name: item.name
    };
    console.log(thisItem);
    this.dataCollection.doc(autoId).set(thisItem);
  }

  private populateList(list: ProductCategory[]) {
    list.forEach(item => {
      this.addItem(item);
    });
  }
}

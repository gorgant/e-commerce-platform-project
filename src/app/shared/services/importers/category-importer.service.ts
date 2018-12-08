import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { SharedModule } from '../../shared.module';
import { ProductCategory } from '../../models/product-category';

@Injectable({
  providedIn: SharedModule
})
export class CategoryImporterService {

  private dataList: ProductCategory[] = [
    {
      categoryValue: 'bread',
      categoryId: 'nAkIDHxy4LjrxvUutb6f',
      categoryName: 'Bread'
    },
    {
      categoryValue: 'dairy',
      categoryId: '4taxaNxPiaud9ag7OA1R',
      categoryName: 'Dairy'
    },
    {
      categoryValue: 'fruits',
      categoryId: 'YCK7k2dbqt4jMHg2xCcI',
      categoryName: 'Fruits'
    },
    {
      categoryValue: 'seasonings',
      categoryId: 'ucGTyQ6XXNh04zPEG42L',
      categoryName: 'Seasonings and Spices'
    },
    {
      categoryValue: 'vegetables',
      categoryId: 'CyMygC0vFNBLXPvt0xez',
      categoryName: 'Vegetables'
    }
  ];

  private listWithIds: ProductCategory[];

  constructor(private afs: AngularFirestore) { }

  launchImport() {
    this.populateList();
    console.log('list populated', this.listWithIds);
  }

  // Batch import to database
  private populateList() {

    // Optionally add new IDs to items
    // this.addIdToItems();

    const batch = this.afs.firestore.batch();
    const dataCollection = this.afs.collection<ProductCategory>('categories');

    if (this.listWithIds) {
      this.listWithIds.map(item => {
        const itemRef = dataCollection.ref.doc(item.categoryId);
        batch.set(itemRef, item, {merge: true});
      });
    } else {
      this.dataList.map(item => {
        const itemRef = dataCollection.ref.doc(item.categoryId);
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
      const itemWithId: ProductCategory = {
        categoryId: autoId,
        categoryName: item.categoryName,
        categoryValue: item.categoryValue
      };
      return itemWithId;
    });
  }
}


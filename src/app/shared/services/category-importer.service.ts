import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { SharedModule } from '../shared.module';
import { ProductCategory } from '../models/product-category';

@Injectable({
  providedIn: SharedModule
})
export class CategoryImporterService {

  private dataCollection: AngularFirestoreCollection<ProductCategory>;
   private categoryList: ProductCategory[] = [
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

  constructor(private afs: AngularFirestore) {
    this.dataCollection = afs.collection<ProductCategory>('categories');

  }

  launchImport() {
    this.populateList(this.categoryList);
    console.log('list populated');
  }

  private addItem(item: ProductCategory) {
    const thisItem: ProductCategory = {
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      categoryValue: item.categoryValue
    };
    console.log(thisItem);
    this.dataCollection.doc(item.categoryId).set(thisItem);
  }

  private populateList(list: ProductCategory[]) {
    list.forEach(item => {
      this.addItem(item);
    });
  }
}


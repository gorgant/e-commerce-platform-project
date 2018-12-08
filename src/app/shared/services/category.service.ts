import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ProductCategory } from '../models/product-category';

@Injectable()
export class CategoryService {

  private productCategoryCollection: AngularFirestoreCollection<ProductCategory>;
  productCategories$: Observable<ProductCategory[]>;

  constructor(private readonly afs: AngularFirestore) { }

  getAllProductCategories() {
    this.productCategoryCollection = this.afs.collection<ProductCategory>('categories', ref => ref.orderBy('categoryName'));
    this.productCategories$ = this.productCategoryCollection.valueChanges();
    return this.productCategories$;
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ProductCategory } from '../models/product-category';

@Injectable()
export class CategoryService {

  private categoryDoc: AngularFirestoreDocument<ProductCategory>;
  singleCategory$: Observable<ProductCategory>;

  private productCategoryCollection: AngularFirestoreCollection<ProductCategory>;
  productCategories$: Observable<ProductCategory[]>;

  constructor(private readonly afs: AngularFirestore) { }

  getAllProductCategories() {
    this.productCategoryCollection = this.afs.collection<ProductCategory>('categories', ref => ref.orderBy('categoryName'));
    this.productCategories$ = this.productCategoryCollection.valueChanges();
    return this.productCategories$;
  }

  getSingleProductCategory(categoryId: string) {
    this.categoryDoc = this.afs.doc<ProductCategory>(`categories/${categoryId}`);
    this.singleCategory$ = this.categoryDoc.valueChanges();
    return this.singleCategory$;
  }
}

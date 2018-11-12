import { Injectable } from '@angular/core';
import { SharedModule } from '../shared.module';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ProductCategory } from '../models/product-category';

@Injectable({
  providedIn: SharedModule
})
export class CategoryService {

  private productCategoryCollection: AngularFirestoreCollection<ProductCategory>;
  productCategories$: Observable<ProductCategory[]>;

  constructor(private readonly afs: AngularFirestore) { }

  refreshProductCategories() {
    this.productCategoryCollection = this.afs.collection<ProductCategory>('categories', ref => ref.orderBy('name'));
    this.productCategories$ = this.productCategoryCollection.valueChanges();
  }

  get productCategories() {
    this.productCategoryCollection = this.afs.collection<ProductCategory>('categories', ref => ref.orderBy('name'));
    this.productCategories$ = this.productCategoryCollection.valueChanges();
    return this.productCategories$;
  }
}

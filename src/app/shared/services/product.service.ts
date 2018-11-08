import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { ProductCategory } from '../models/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productDoc: AngularFirestoreDocument<Product>;
  singleProduct$: Observable<Product>;

  private productsCollection: AngularFirestoreCollection<Product>;
  products$: Observable<Product[]>;

  private productCategoryCollection: AngularFirestoreCollection<ProductCategory>;
  productCategories$: Observable<ProductCategory[]>;

  constructor(private readonly afs: AngularFirestore) {
  }

  getSingleProduct(productId: string): Observable<Product> {
    this.productDoc = this.afs.doc<Product>(`products/${productId}`);
    this.singleProduct$ = this.productDoc.valueChanges();
    return this.singleProduct$;
  }

  getProducts(): Observable<Product[]> {
    this.productsCollection = this.afs.collection<Product>('products');
    this.products$ = this.productsCollection.valueChanges();
    return this.products$;
  }

  refreshProductCategories() {
    this.productCategoryCollection = this.afs.collection<ProductCategory>('categories', ref => ref.orderBy('name'));
    this.productCategories$ = this.productCategoryCollection.valueChanges();
  }

}

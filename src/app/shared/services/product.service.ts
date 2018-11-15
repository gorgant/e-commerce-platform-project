import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { ProductCategory } from '../models/product-category';
import { map } from 'rxjs/operators';

// This is provided in the Shared module provider array bc if provided
// here it causes a circular dependency with product card
@Injectable()
export class ProductService {

  private productDoc: AngularFirestoreDocument<Product>;
  singleProduct$: Observable<Product>;

  private productsCollection: AngularFirestoreCollection<Product>;
  products$: Observable<Product[]>;

  filteredProductList$: Observable<Product[]>;

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
    this.filteredProductList$ = this.products$;
    return this.products$;
  }

  saveProduct(product: Product) {
    this.productDoc.update(product);
  }

  createProduct(product: Product) {
    const autoId = this.afs.createId();
    product.id = autoId;
    this.productsCollection = this.afs.collection<Product>('products');
    this.productsCollection.doc(autoId).set(product);
  }

  deleteProduct(productId: string) {
    this.productsCollection = this.afs.collection<Product>('products');
    this.productsCollection.doc(productId).delete();
  }

  applyCategoryFilter(productCategory: ProductCategory) {
    this.filteredProductList$ = this.products$.pipe(
      map(products => {
        return products.filter(product => {
          return product.category === productCategory.category;
        });
    }));
  }
}

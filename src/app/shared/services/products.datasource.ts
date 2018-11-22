// import { DataSource } from '@angular/cdk/table';
// import { Product } from '../models/product';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { ProductService } from './product.service';
// import { CollectionViewer } from '@angular/cdk/collections';

// export class ProductsDataSource implements DataSource<Product> {
//   private productSubject = new BehaviorSubject<Product[]>([]);
//   private loadingSubject = new BehaviorSubject<boolean>(false);
//   public loading$ = this.loadingSubject.asObservable();

//   constructor(private productService: ProductService) { }

//   loadProducts() {
//     this.loadingSubject.next(true);
//     this.productService.getProducts()
//       .subscribe(
//         products => this.productSubject.next(products)
//       );
//   }

//   connect(collectionViewer: CollectionViewer): Observable<Product[]> {
//     console.log('Connecting data source');
//     return this.productSubject.asObservable();
//   }

//   disconnect(collectionViewer: CollectionViewer): void {
//     this.productSubject.complete();
//     this.loadingSubject.complete();
//   }
// }

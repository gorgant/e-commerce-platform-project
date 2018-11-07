import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { ProductCategory } from 'src/app/shared/models/product-category';
import { Observable, from, of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  private productCategoryCollection: AngularFirestoreCollection<ProductCategory>;
  productCategories: Observable<ProductCategory[]>;

  product$: Observable<Product>;

  productForm = this.fb.group({
    title: [''],
    price: [''],
    category: [''],
    imageUrl: ['']
  });

  constructor(private readonly afs: AngularFirestore, private fb: FormBuilder) {
    this.productCategoryCollection = afs.collection('categories', ref => ref.orderBy('name'));
    this.productCategories = this.productCategoryCollection.valueChanges();

    this.product$ = of(
      {
        $key: 'string',
        title: 'Whole milk',
        price: 3,
        category: '4taxaNxPiaud9ag7OA1R',
        imageUrl: 'https://loremflickr.com/286/180'
      }
    );
  }

  ngOnInit() {
    if (this.product$) {
      console.log(this.product$);
      this.loadProductData();
    }
  }

  loadProductData() {
    let currentProduct: Product;
    this.product$.subscribe( data => {
      currentProduct = data;
    });
    console.log(currentProduct);
    this.productForm.setValue({
      title: currentProduct.title,
      price: currentProduct.price,
      category: currentProduct.category,
      imageUrl: currentProduct.imageUrl
    });
  }

  onSubmit() {
    console.log('form submitted');
    console.log(this.productForm.value);
  }

}

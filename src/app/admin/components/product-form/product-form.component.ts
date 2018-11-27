import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { Subscription, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import {
  ProductUpdateRequested,
  ProductAddRequested,
  ProductDeleteRequested
} from 'src/app/shared/store/product.actions';
import { selectAllCategories, selectCategoryById } from 'src/app/shared/store/category.selectors';
import { ProductCategory } from 'src/app/shared/models/product-category';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  productCategories$: Observable<ProductCategory[]>;
  storeSubscription: Subscription;

  productForm: FormGroup;
  categoryText: string;

  product: Product;
  newProduct: boolean;

  validationPattern: RegExp = /^(ftp|http|https):\/\/[^ "]+$/;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
    ) { }

  ngOnInit() {

    // Categories store initialized in nav bar component
    this.productCategories$ = this.store
    .pipe(
      select(selectAllCategories)
    );

    this.productForm = this.fb.group({
      productId: [''],
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      categoryValue: [''],
      imageUrl: ['', [Validators.required, Validators.pattern(this.validationPattern)]]
    });

    // Data here is pulled from the product resolver, which is in turn pulled from the Store
    if (this.route.snapshot.data['productFS']) {
      this.newProduct = false;
      this.product = this.route.snapshot.data['productFS'];
      this.productForm.patchValue({
        productId: this.product.productId,
        title: this.product.title,
        price: this.product.price,
        categoryId: this.product.categoryId,
        categoryValue: this.product.categoryValue,
        imageUrl: this.product.imageUrl
      });
    } else {
      this.newProduct = true;
    }
  }

  onSave() {
    const formValues: Product = this.productForm.value;
    if (!this.newProduct) {
      this.store.dispatch(new ProductUpdateRequested({product: formValues}));
    } else {
      this.store.dispatch(new ProductAddRequested({product: formValues}));
    }
    this.router.navigate(['/admin/products']);
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.store.dispatch(new ProductDeleteRequested({productId: this.product.productId}));
      this.router.navigate(['/admin/products']);
    }
  }

  // This fires when the Category select field is changed, allowing access to the category object
  // Without this, when saving the form, the category name will not populate on the form
  setCategory(categoryId: string) {
    this.storeSubscription = this.store.pipe(select(selectCategoryById(categoryId)))
      .subscribe(category => {
        this.productForm.patchValue({
          categoryValue: category.categoryValue
        });
      });
  }

  // These getters are used for easy access in the HTML template
  get title() { return this.productForm.get('title'); }
  get price() { return this.productForm.get('price'); }
  get categoryId() { return this.productForm.get('categoryId'); }
  get imageUrl() { return this.productForm.get('imageUrl'); }

  ngOnDestroy() {
    if (this.storeSubscription) {
      this.storeSubscription.unsubscribe();
    }
  }

}

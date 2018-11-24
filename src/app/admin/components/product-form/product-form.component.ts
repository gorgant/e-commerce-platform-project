import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/shared/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/shared/services/category.service';
import { AppState } from 'src/app/reducers';
import { Store } from '@ngrx/store';
import { ProductUpdated } from 'src/app/shared/store/product.actions';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  categorySubscription: Subscription;

  productForm: FormGroup;
  categoryText: string;

  product: Product;
  newProduct: boolean;

  validationPattern: RegExp = /^(ftp|http|https):\/\/[^ "]+$/;


  constructor(
    private fb: FormBuilder,
    public productService: ProductService,
    public categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
    ) { }

  ngOnInit() {

    this.categoryService.refreshProductCategories();

    this.productForm = this.fb.group({
      productId: [''],
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      category: [''],
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
        category: this.product.category,
        imageUrl: this.product.imageUrl
      });
    } else {
      this.newProduct = true;
    }
  }

  onSave() {
    if (!this.newProduct) {
      const formValues: Product = this.productForm.value;
      this.productService.saveProduct(formValues);
      console.log(formValues);

      const product: Update<Product> = {
        id: formValues.productId,
        changes: formValues
      };
      this.store.dispatch(new ProductUpdated({product}));

    } else {
      const formValues: Product = this.productForm.value;
      this.productService.createProduct(formValues);
      console.log(formValues);
    }
    this.router.navigate(['/admin/products']);
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.product.productId);
      this.router.navigate(['/admin/products']);
    }
  }

  // This fires when the Category select field is changed, pulling the object category vs the value
  setCategory() {
    const categoryId = this.productForm.value.categoryId;
    this.categorySubscription = this.categoryService.productCategories
      .subscribe( prodCat => {
        const filteredCats = prodCat.filter(cat => cat.id === categoryId);
        this.categoryText = (filteredCats.length > 0) ? filteredCats[0].category : null;
        this.productForm.patchValue({
          category: this.categoryText
        });
      });
  }

  // These getters are used for easy access in the HTML template
  get title() { return this.productForm.get('title'); }
  get price() { return this.productForm.get('price'); }
  get categoryId() { return this.productForm.get('categoryId'); }
  get imageUrl() { return this.productForm.get('imageUrl'); }

  ngOnDestroy() {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { Observable, of, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/shared/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, tap, take } from 'rxjs/operators';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnDestroy {

  // This prevents an error when "loading" a new product
  emptyProduct: Product = {
    id: '',
    title: '',
    price: null,
    categoryId: '',
    category: '',
    imageUrl: ''
  };

  product$: Observable<Product> = of(this.emptyProduct);
  productId: string;

  categorySubscription: Subscription;

  productForm: FormGroup;
  categoryText: string;

  newProduct: boolean;

  validationPattern: RegExp = /^(ftp|http|https):\/\/[^ "]+$/;

  constructor(
    private fb: FormBuilder,
    public productService: ProductService,
    public categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    this.categoryService.refreshProductCategories();

    // this.newProduct = true;

    this.productForm = this.fb.group({
      productId: [''],
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      categoryId: ['', Validators.required],
      category: [''],
      imageUrl: ['', [Validators.required, Validators.pattern(this.validationPattern)]]
    });

    if (this.router.url !== '/admin/products/new') {
      this.newProduct = false;
      this.product$ = this.route.paramMap.pipe(
        switchMap(params => {
          this.productId = params.get('id');
          return this.productService.getSingleProduct(this.productId);
        }),
        take(1),
        tap(product => this.productForm.patchValue({
          productId: product.id,
          title: product.title,
          price: product.price,
          categoryId: product.categoryId,
          category: product.category,
          imageUrl: product.imageUrl
        }))
      );
    } else {
      this.newProduct = true;
    }
  }

  onSave() {
    if (!this.newProduct) {
      const formValues: Product = this.productForm.value;
      this.productService.saveProduct(formValues);
      console.log(formValues);
    } else {
      const formValues: Product = this.productForm.value;
      this.productService.createProduct(formValues);
      console.log(formValues);
    }
    this.router.navigate(['/admin/products']);
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.productId);
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

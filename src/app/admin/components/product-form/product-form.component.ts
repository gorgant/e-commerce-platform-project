import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { Observable, of } from 'rxjs';
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
export class ProductFormComponent implements OnInit {

  // This prevents an error when "loading" a new product
  emptyProduct: Product = {
    id: '',
    title: '',
    price: 0,
    categoryId: '',
    category: '',
    imageUrl: ''
  };

  product$: Observable<Product> = of(this.emptyProduct);
  productId: string;

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
    this.loadProductCategories();

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

  loadProductCategories() {
    this.categoryService.refreshProductCategories();
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
    this.productService.deleteProduct(this.productId);
  }

  // This fires when the Category select field is changed, pulling the object category vs the value
  setCategory() {
    const categoryId = this.productForm.value.categoryId;
    this.categoryService.productCategories
      .subscribe( prodCat => {
        const filteredCats = prodCat.filter(cat => cat.id === categoryId);
        this.categoryText = (filteredCats.length > 0) ? filteredCats[0].category : null;
        this.productForm.patchValue({
          category: this.categoryText
        });
      });
  }

  get title() { return this.productForm.get('title'); }
  get price() { return this.productForm.get('price'); }
  get categoryId() { return this.productForm.get('categoryId'); }
  get imageUrl() { return this.productForm.get('imageUrl'); }

}

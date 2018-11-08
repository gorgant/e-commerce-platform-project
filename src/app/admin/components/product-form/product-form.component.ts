import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { Observable, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  product$: Observable<Product>;
  productId: string;

  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public productService: ProductService,
    private route: ActivatedRoute
    ) {
  }

  ngOnInit() {
    this.loadProductCategories();

    this.productForm = this.fb.group({
      title: [''],
      price: [''],
      category: [''],
      categoryId: [''],
      imageUrl: ['']
    });

    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.productId = params.get('id');
        return this.productService.getSingleProduct(this.productId);
      }),
      tap(product => this.productForm.patchValue({
        title: product.title,
        price: product.price,
        category: product.category,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl
      }))
    );
  }

  loadProductCategories() {
    this.productService.refreshProductCategories();
  }

  onSubmit() {
    console.log('form submitted');
    console.log(this.productForm.value);
  }

}

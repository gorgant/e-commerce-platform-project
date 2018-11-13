import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductCategory } from 'src/app/shared/models/product-category';
import { ProductService } from 'src/app/shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit, OnDestroy {

  paramsSubscription: Subscription;
  paramsId: string;

  catServiceSubscription: Subscription;
  selectedCategory: ProductCategory;

  allCategories: boolean;

  constructor(
    public categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    ) { }

  ngOnInit() {

    this.paramsSubscription = this.route.queryParamMap.pipe(
      switchMap(params => {
        if (params.get('categoryId')) {
          this.allCategories = false;
          this.paramsId = params.get('categoryId');
        } else {
          this.clearCategoryFilters();
        }
        return this.categoryService.refreshProductCategories();
      }),
      tap(() => {
        if (this.paramsId) {
          this.catServiceSubscription = this.categoryService.getSingleProductCategory(this.paramsId)
            .subscribe( prodCat => {
              this.selectedCategory = prodCat;
              this.productService.applyCategoryFilter(this.selectedCategory);
            });
        }
      })
    ).subscribe(); // this tap function won't work unless you subscribe
  }

  clearCategoryFilters() {
    this.allCategories = true;
    this.paramsId = null;
    this.selectedCategory = null;
    this.productService.getProducts();
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.catServiceSubscription) {
      this.catServiceSubscription.unsubscribe();
    }
  }
}

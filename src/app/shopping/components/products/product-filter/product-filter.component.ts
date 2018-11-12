import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductCategory } from 'src/app/shared/models/product-category';
import { ProductService } from 'src/app/shared/services/product.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit, OnDestroy {

  selectedCategory: ProductCategory;
  allCategories: boolean;
  paramsId: string;

  categorySubscription: Subscription;

  constructor(
    public categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit() {
    this.categoryService.refreshProductCategories();
    this.allCategories = true;
    if (this.route.snapshot.queryParams.categoryId) {
      this.allCategories = false;
      this.paramsId = this.route.snapshot.queryParams.categoryId;
      this.categorySubscription = this.categoryService.getSingleProductCategory(this.paramsId)
        .subscribe( category => {
          this.selectedCategory = category;
          this.productService.applyCategoryFilter(this.selectedCategory);
        });
    }
  }

  onSelect(category: ProductCategory): void {
    this.allCategories = false;
    this.selectedCategory = category;
    this.productService.applyCategoryFilter(category);
    this.router.navigate([''], { queryParams: {category: category.category, categoryId: category.id}});
  }

  clearCategoryFilters() {
    this.allCategories = true;
    this.selectedCategory = null;
    this.productService.getProducts();
  }

  ngOnDestroy() {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
  }
}

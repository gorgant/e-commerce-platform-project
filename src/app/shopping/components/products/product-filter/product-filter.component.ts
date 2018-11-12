import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductCategory } from 'src/app/shared/models/product-category';
import { ProductService } from 'src/app/shared/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {

  selectedCategory: ProductCategory;
  allCategories = true;

  constructor(
    public categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    ) { }

  ngOnInit() {
    this.categoryService.refreshProductCategories();
  }

  onSelect(category: ProductCategory): void {
    this.allCategories = false;
    this.selectedCategory = category;
    this.productService.applyCategoryFilter(category);
    this.router.navigate([''], { queryParams: {category: category.category}});
  }

  clearCategoryFilters() {
    this.allCategories = true;
    this.selectedCategory = null;
    this.productService.getProducts();
  }
}

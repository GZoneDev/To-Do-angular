import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category.service';
import { TargetCategoryHelperService } from '../../services/targetCategoryHelper.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [CategoryService],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit, OnDestroy {
  public title: string = "Category";
  public addCategoryButtonName: string = "Create category";
  public addCategoryPlaceholderName: string = "Enter category name";
  public searchPlaceholder: string = 'Search';
  public saveEditCategoryButtonName: string = "Save";
  public cancelEditCategoryButtonName: string = "Cancel";
  public deleteEditCategoryButtonName: string = "Delete";
  public loadNextCategoryButtonName: string = "Load";

  protected searchCategoryName: string = '';
  protected editCategoryName: string = '';
  protected newCategoryName: string = '';
  protected editIndex: number | null = null;
  private currentPageIndex: number = 0;
  private currentPageSize: number = 10;

  private categorySubscription!: Subscription;
  public categories: Category[] = [];

  public constructor(
    private categoryService: CategoryService,
    private targetCategoryService: TargetCategoryHelperService) {}

  public ngOnInit(): void {
    this.loadCategories();
    this.categorySubscription = this.categoryService.categories$.subscribe(data => {
      this.categories = data;
    });
  }
  
  public loadCategories(): void {  
    this.categoryService.getCategories(this.currentPageIndex, this.currentPageSize, this.searchCategoryName)
      .subscribe(data => {
        if (data.length === this.currentPageSize) {
          ++this.currentPageIndex;
        }
      });
  }

  public ngOnDestroy():void {
    if (this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
  }

  protected setTargetCategory(index: number) {
    this.targetCategoryService.setCategory(this.categories[index].id);
  }

  protected search(): void {
    this.currentPageIndex = 0;
    this.categoryService.clearCategories();
    this.loadCategories();
  }

  protected allReloadCategories(): void {  
    this.categoryService.getCategories(0, this.categories.length + 2, this.searchCategoryName).subscribe();
  }

  protected createCategory(): void {
    if (this.newCategoryName.trim()) {
      this.categoryService.create(this.newCategoryName).subscribe({
        next: () =>{
          this.allReloadCategories();
          this.loadCategories();
          this.newCategoryName = '';
        }
      });     
    }
  }

  protected startEdit(index: number): void {
    this.editIndex = index;
    this.editCategoryName = this.categories[index].name;
  }

  protected saveEdit(): void {
    const index = this.editIndex;
    const newName = this.editCategoryName.trim();

    if (index !== null && newName) {
      this.categoryService.update(this.categories[index].id, newName)
      .subscribe( {
        next: () => {
          this.categories[index].name = newName;
        }
      });
      
      this.editIndex = null;
      this.editCategoryName = '';
    }
  }

  protected cancelEdit(): void {
    this.editIndex = null;
    this.editCategoryName = '';
  }

  protected deleteCategory(index: number): void {
    if (index !== null) {
      this.categoryService.delete(this.categories[index].id)
        .subscribe( {
          next: () => {
            this.allReloadCategories();
          }
        })    
    }

    this.cancelEdit();
  }
}
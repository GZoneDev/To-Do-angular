import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; 
import { HttpParams } from '@angular/common/http';

import { HttpService } from './http.service';
import { Category } from '../models/Category';
import { CreateCategoryRequest } from '../contracts/category/CreateCategoryRequest';
import { UpdateCategoryRequest } from '../contracts/category/UpdateCategoryRequest';
import { DeleteCategoryRequest } from '../contracts/category/DeleteCategoryRequest';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends HttpService {
  private createApiUrl = '/taskApi/Category/Create';
  private updateApiUrl = '/taskApi/Category/Update';
  private deleteApiUrl = '/taskApi/Category/Delete';
  private getApiUrl = '/taskApi/Category/Get';
  private getByNameApiUrl = '/taskApi/Category/GetByName';

  private categoriesSubject: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  public categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  private currentPageIndex: number = 0;
  private currentPageSize: number = 10;

  public constructor(private http: HttpClient) {
    super();
  }

  public getCategories(pageIndex: number = this.currentPageIndex,
    pageSize: number = this.currentPageSize,
    searchName: string = ''): Observable<Category[]> {

    this.currentPageIndex = pageIndex;
    this.currentPageSize = pageSize;

    let apiUrl: string = this.getApiUrl;
    const userId = this.getUserId();

    let params: HttpParams = new HttpParams()
        .set('userId', userId)
        .set('index', pageIndex.toString())
        .set('number', pageSize.toString());

    if (searchName !== '') {
      apiUrl = this.getByNameApiUrl;
      params = params.set('categoryName', searchName); 
    }

    return this.http.get<Category[]>(`${apiUrl}?${params.toString()}`, {headers: HttpService.headers})
        .pipe(
          tap(newCategories => {
            const currentCategories = this.categoriesSubject.value;
            const updatedCategories = [
                ...currentCategories,
                ...newCategories.filter(category => !currentCategories.some(c => c.id === category.id))
            ];
            this.categoriesSubject.next(updatedCategories);
          }),         
          catchError(this.checkAuthorization)
        );
  }

  public create(categoryName: string): Observable<any> {
    const userId = this.getUserId();
    const body: CreateCategoryRequest = { userId: userId, name: categoryName };
    
    return this.http.post<any>(this.createApiUrl, body, { headers: HttpService.headers }).pipe(
      catchError(this.checkAuthorization));
  }

  public update(categoryId: string, categoryName: string): Observable<any> {
    const userId = this.getUserId();
    const body: UpdateCategoryRequest = { userId: userId, categoryId: categoryId, name: categoryName };

    return this.http.post<any>(this.updateApiUrl, body, { headers: HttpService.headers }).pipe(
      tap(() => {
        const currentCategories = this.categoriesSubject.value.map(category =>
          category.id === categoryId ? { ...category, name: categoryName } : category
        );
        this.categoriesSubject.next(currentCategories);
      }),         
      catchError(this.checkAuthorization)
    );
  }

  public delete(categoryId: string): Observable<any> {
    const body: DeleteCategoryRequest = { categoryId: categoryId };

    return this.http.post<any>(this.deleteApiUrl, body, { headers: HttpService.headers }).pipe(
      tap(() => {
        const currentCategories = this.categoriesSubject.value.filter(category => category.id !== categoryId);
        this.categoriesSubject.next(currentCategories);
      }),         
      catchError(this.checkAuthorization)    
    );
  }

  public clearCategories(): void {
    this.categoriesSubject.next([]);
  }
}
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; 
import { HttpParams } from '@angular/common/http';

import { HttpService } from './http.service';
import { Task } from '../models/Task';
import { CreateTaskRequest } from '../contracts/task/CreateTaskRequest';
import { UpdateTaskRequest } from '../contracts/task/UpdateTaskRequest';
import { DeleteTaskRequest } from '../contracts/task/DeleteTaskRequest';
import { TargetCategoryHelperService } from './targetCategoryHelper.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService extends HttpService implements OnInit{
  private createApiUrl = '/taskApi/TaskInfo/Create';
  private updateApiUrl = '/taskApi/TaskInfo/Update';
  private deleteApiUrl = '/taskApi/TaskInfo/Delete';
  private getApiUrl = '/taskApi/TaskInfo/Get';

  private currentPageIndex: number = 0;
  private currentPageSize: number = 10;

  private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  public constructor(private http: HttpClient, private targetCategoryService: TargetCategoryHelperService) {
    super();
  }

  public ngOnInit() {
    this.targetCategoryService.categoryChange$.subscribe((categoryId: string) => {
      console.log(categoryId);
      this.getTasks();
    });
  }

  public getCategoryId(): string { 
    return this.targetCategoryService.getCategory();
  }

  public getTasks(pageIndex: number = this.currentPageIndex,
    pageSize: number = this.currentPageSize): Observable<Task[]> {
    
      if (this.getCategoryId() === '')
        return throwError(() => new Error('categoryId empty'));

    this.currentPageIndex = pageIndex;
    this.currentPageSize = pageSize;

    const params: HttpParams = new HttpParams()
        .set('categoryId', this.getCategoryId())
        .set('index', pageIndex.toString())
        .set('number', pageSize.toString());

    return this.http.get<Task[]>(`${this.getApiUrl}?${params.toString()}`, { headers: HttpService.headers })
        .pipe(
            tap(newTasks => this.tasksSubject.next(newTasks)),
            catchError(this.checkAuthorization)
        );
  }

  public create(name: string, description: string): Observable<any> {
    const body: CreateTaskRequest = { categoryId: this.getCategoryId(), name: name, description: description };
    
    if (this.getCategoryId() === '')
      return throwError(() => new Error('categoryId empty'));

    return this.http.post<any>(this.createApiUrl, body, { headers: HttpService.headers }).pipe(
      catchError(this.checkAuthorization));
  }

  public update(taskId:string, name: string, description: string): Observable<any> {
    const userId = this.getUserId();
    const body: UpdateTaskRequest = { taskId: taskId, categoryId: this.getCategoryId(), name: name, description: description };

    if (this.getCategoryId() === '')
      return throwError(() => new Error('categoryId empty'));

    return this.http.post<any>(this.updateApiUrl, body, { headers: HttpService.headers }).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.value.map(task =>
          task.id === taskId ? { ...task, name: name, description: description } : task
        );
        this.tasksSubject.next(currentTasks);
      }),         
      catchError(this.checkAuthorization)
    );
  }

  public delete(taskId: string): Observable<any> {
    const body: DeleteTaskRequest = { taskId: taskId, categoryId: this.getCategoryId() };

    if (this.getCategoryId() === '')
      return throwError(() => new Error('categoryId empty'));

    return this.http.post<any>(this.deleteApiUrl, body, { headers: HttpService.headers }).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.value.filter(category => category.id !== taskId);
        this.tasksSubject.next(currentTasks);
      }),         
      catchError(this.checkAuthorization)    
    );
  }
}
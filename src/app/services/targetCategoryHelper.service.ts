import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TargetCategoryHelperService {
    private categoryChangeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public categoryChange$: Observable<string> = this.categoryChangeSubject.asObservable();

    private currentCategoryId: string = '64c24ee0-c1e6-4069-97e7-8aae716f9c77';

    public constructor() {}

    public setCategory(newCategory: string): void {       
        this.currentCategoryId = newCategory;
        this.categoryChangeSubject.next(this.currentCategoryId);
        console.log('TargetCategoryHelperService published event');
    }

    public getCategory(): string {
        return this.currentCategoryId;
    }
}
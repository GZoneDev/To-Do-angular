import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export class HttpService {
  protected static readonly headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  protected getUserId(): string {
    let id: string | null = localStorage.getItem('UserId'); 
    return id ? id : '';
  }

  protected checkAuthorization(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401)
    {
      localStorage.clear();
    }   
    
    console.error(error.message);
    return throwError(() => new Error(error.message));
  }
}

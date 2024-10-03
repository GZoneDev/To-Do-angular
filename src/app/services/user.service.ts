import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpService } from './http.service';
import { LoginUserRequest } from '../contracts/user/LoginUserRequest';
import { RegisterUserRequest } from '../contracts/user/RegisterUserRequest';

@Injectable({
  providedIn: 'root'
})
export class UserService extends HttpService {
  private loginApiUrl = '/authApi/Auth/authorization';
  private logoutApiUrl = '/authApi/Auth/logout';
  private registerApiUrl = '/authApi/Auth/register';
  
  public constructor(private http: HttpClient) {
    super();
  }

  public loginUser(email: string, password: string): Observable<any> {
    const body: LoginUserRequest = { email: email, password: password };
    return this.http.post<any>(this.loginApiUrl, body, {headers: HttpService.headers});
  }

  public registerUser(username: string, email: string, password: string): Observable<any> {
    const body: RegisterUserRequest = { username:username, email: email, password: password };
    return this.http.post<any>(this.registerApiUrl, body, {headers: HttpService.headers});
  }

  public logoutUser(): Observable<any>  {
    localStorage.clear();
    return this.http.get<any>(this.logoutApiUrl, {headers: HttpService.headers});
  }
}
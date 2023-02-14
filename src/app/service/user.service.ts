import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CustomResponse } from '../interface/custom-reponse';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/user';

  constructor(private http: HttpClient) { }

  users$ = this.http.get<CustomResponse>(this.apiUrl)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  save$ = (user: User) => this.http.post<CustomResponse>(this.apiUrl, user)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    )

  user$ = (uid: number) => this.http.get<CustomResponse>(this.apiUrl + "/" + uid)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  delete$ = (uid: number) => this.http.delete<CustomResponse>(this.apiUrl + "/" + uid)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  update$ = (user: User, uid: number) =>
    this.http.put<CustomResponse>(this.apiUrl + '/' + uid, user)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error)
    return throwError(() => 'An error occured - Error code : ' + error.status);
  }
}
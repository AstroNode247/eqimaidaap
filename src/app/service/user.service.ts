import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { DataState } from '../enum/data-state.enum';
import { CustomResponse } from '../interface/custom-reponse';
import { RecognizerError } from '../interface/recognizer-response';
import { User } from '../interface/user';
import { LoaderService } from './loader.service';

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

  user$ = (uid: string) => this.http.get<CustomResponse>(this.apiUrl + "/" + uid)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  addFingerprint$ = (uid: string, fileName: string) => this.http.post<CustomResponse>(
    this.apiUrl + "/" + uid + "/fingerprint", fileName)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    )

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

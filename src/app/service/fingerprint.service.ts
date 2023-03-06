import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError, scan, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Recognizer } from '../interface/recognizer';
import { BehaviorSubject, merge, Observable, Subject, throwError } from 'rxjs';
import { RecognizerResponse } from '../interface/recognizer_response';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class FingerprintService {
  private readonly apiUrl = "http://127.0.0.1:5000/";
  private showFingerSubject = new BehaviorSubject<string>('');
  private responseSubject? = new BehaviorSubject<RecognizerResponse | null>(null); 
  responseAction$ = this.responseSubject?.asObservable();
  private reloadSubject = new Subject<void>();
  showFingerSubject$ = this.showFingerSubject.asObservable();

  constructor(private http: HttpClient) { }

  setResponse(response?: RecognizerResponse | null) {
    this.responseSubject?.next(response!);
  }

  fingerObs$ = merge(
    this.showFingerSubject,
    this.reloadSubject
  ).pipe(
    scan((oldValue, currentValue) => {
      if(!oldValue && !currentValue) {
        throw new Error(`Reload can't run before initial load`);
      }
      return currentValue || oldValue;
    }),
    tap(console.log)
  )

  reload(): void {
    this.reloadSubject.next();
  }

  showFingerprint(userName: string, fileName: string) {
    this.showFingerSubject.next(this.apiUrl + "/v1/fingerprint/" + userName + "/" + fileName);
  }

  showDefaultFingerprint() {
    this.showFingerSubject.next(this.apiUrl + "/v1/fingerprint");
  }

  hideFingerprint() {
    this.showFingerSubject.next('');
  }

  showDefaultFingerprint$ = this.http.get(this.apiUrl + 'v1/fingerprint', { responseType: 'blob' })
    .pipe(
      catchError(this.handleError)
    )
  
  comparison$ = (user: User) => this.http.post<RecognizerResponse>(this.apiUrl + 'v1/compute/fingerprint', user)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    )

    handleError(error: HttpErrorResponse): Observable<never> {
      console.log(error)
      throw throwError(() => 'An error occured - Error code : ' + error.status)
    }

  version$ = this.http.get<Recognizer>("http://127.0.0.1:5000/version")
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    );

  upload$ = (user: User) => this.http.post<RecognizerResponse>(this.apiUrl + 'v1/upload/fingerprint', user)
    .pipe(
      tap(console.log),
      catchError(this.handleError)
    )
}

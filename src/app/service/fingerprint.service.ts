import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError, scan, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Recognizer } from '../interface/recognizer';
import { BehaviorSubject, merge, Observable, Subject, throwError } from 'rxjs';
import { RecognizerResponse } from '../interface/recognizer-response';
import { User } from '../interface/user';
import { ActionState } from '../enum/action-state.enum';

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
  private isSignOnSubject = new BehaviorSubject<boolean>(false);
  isSignOnAction$ = this.isSignOnSubject.asObservable();
  private fingerCountSubject = new BehaviorSubject<number>(0);
  fingerCountAction$ = this.fingerCountSubject.asObservable();
  private maxCountSubject = new BehaviorSubject<number>(3);
  maxCountAction$ = this.maxCountSubject.asObservable();
  private maxFinger = 3;
  private fingerCount: number = 0;
  private actionStateSubject = new BehaviorSubject<ActionState | null>(null);
  actionState$ = this.actionStateSubject.asObservable();

  constructor(private http: HttpClient) { }

  setResponse(response?: RecognizerResponse | null) {
    this.responseSubject?.next(response!);
  }

  setFingerCount(nbr: number) {
    this.fingerCount = nbr;
    this.fingerCountSubject.next(nbr);
  }

  getFingerCount() {
    return this.fingerCount;
  }

  getMaxFinger() {
    return this.maxFinger;
  }

  isSignOn() {
    if (this.fingerCount > this.maxFinger) {
      this.isSignOnSubject.next(true);
      return true;
    }
    this.isSignOnSubject.next(false);
    return false;
    // this.isSignOnSubject.next(this.fingerCount >= this.maxFinger);
  }

  initSignOn() {
    this.fingerCount = 0;
    this.fingerCountSubject.next(0);
    this.isSignOnSubject.next(false);
  }

  signOnAction() {
    this.actionStateSubject.next(ActionState.SIGNON);
  }

  signInAction() {
    this.actionStateSubject.next(ActionState.SIGNIN);
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

  sift$ = (user: User) => this.http.post<RecognizerResponse>(this.apiUrl + "v1/sift/fingerprint", user)
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      )

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

  private handleError(error: HttpErrorResponse): Observable<never> {
      console.log(error)
      return throwError(() => error.error)
    }
}

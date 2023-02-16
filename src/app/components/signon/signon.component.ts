import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/enum/data-state.enum';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-reponse';
import { User } from 'src/app/interface/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'eq-signon',
  templateUrl: './signon.component.html',
  styleUrls: ['./signon.component.css']
})
export class SignonComponent implements OnInit {
  user: User = { uid: null };
  user_info?: number | null;
  appState$?: Observable<AppState<CustomResponse | null>>;
  private dataSubject = new BehaviorSubject<CustomResponse | null>(null);

  private hasRegistered = new BehaviorSubject<boolean>(false);
  hasRegistered$ = this.hasRegistered.asObservable();

  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  readonly DataState = DataState;

  constructor(private userService: UserService) { }


  ngOnInit(): void {
    this.appState$ = this.userService.users$
      .pipe(
        map(response => {
          return { dataState: DataState.LOADED, appData: response }
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }



  registerUser() {
    this.isLoading.next(true);
    this.appState$ = this.userService.save$(this.user)
      .pipe(
        map(response => {
          this.dataSubject.next(
            { ...response, data: { users: [response.data.user, this.dataSubject.value?.data.users] } }
          );
          this.isLoading.next(false);
          this.hasRegistered.next(true);
          this.user_info = this.user.uid;
          return { dataState: DataState.LOADED, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoading.next(false);
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }

  onAddFingerprint() {
    this.appState$ = this.userService.addFingerprint$(this.user.uid!)
      .pipe(
        map(response => {
          this.dataSubject.next(
            { ...response, data: { fingerprints: [response.data.fingerprint, 
              this.dataSubject.value?.data.fingerprints] } }
          );
          return { dataState: DataState.LOADED, appData: this.dataSubject.value }
            }),
          startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
          catchError((error: string) => {
            return of({ dataState: DataState.ERROR, error });
          })
      );
  }
}

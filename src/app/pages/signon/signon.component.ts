import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/enum/data-state.enum';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-reponse';
import { Recognizer } from 'src/app/interface/recognizer';
import { RecognizerResponse } from 'src/app/interface/recognizer_response';
import { User } from 'src/app/interface/user';
import { FingerprintService } from 'src/app/service/fingerprint.service';
import { LoaderService } from 'src/app/service/loader.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'eq-signon',
  templateUrl: './signon.component.html',
  styleUrls: ['./signon.component.css']
})
export class SignonComponent implements OnInit {
  user: User = { uid: null };
  user_info?: string | null;
  fileName?: string;
  appState$?: Observable<AppState<CustomResponse | null>>;
  fingerState$?: Observable<AppState<RecognizerResponse | null>>;

  private dataSubject = new BehaviorSubject<CustomResponse | null>(null);
  private recognizerSubject = new BehaviorSubject<RecognizerResponse | null>(null);

  private hasRegistered = new BehaviorSubject<boolean>(false);
  hasRegistered$ = this.hasRegistered.asObservable();

  showLoader$ = this.loaderService.loadingAction$;;

  readonly DataState = DataState;

  constructor(private userService: UserService,
    private fingerprintService: FingerprintService,
    private loaderService: LoaderService) { }


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
    this.fingerState$ = this.fingerprintService.version$
      .pipe(
        map(response => {
          return { dataState: DataState.LOADED, appData: response }
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error })
        })
      );

    // this.vm$ = combineLatest([this.appState$!, this.fingerState$!, this.hasRegistered$, this.showLoader$]).pipe(
    //   map(([appState, fingerState, hasRegistered, showLoader]) => {
    //     return { appState, fingerState, hasRegistered, showLoader };
    //   })
    // )
  }

  registerUser() {
    this.loaderService.showLoader();
    this.appState$ = this.userService.save$(this.user)
      .pipe(
        map(response => {
          this.dataSubject.next(
            { ...response, data: { users: [response.data.user, this.dataSubject.value?.data.users] } }
          );
          this.loaderService.hideLoader();
          this.hasRegistered.next(true);
          this.user_info = this.user.uid;
          return { dataState: DataState.LOADED, appData: this.dataSubject.value }
        }),
        startWith({ dataState: DataState.LOADED }),
        catchError((error: string) => {
          this.loaderService.hideLoader();
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }

  onAddFingerprint() {
    this.fingerState$ = this.fingerprintService.upload$(this.user)
      .pipe(
        map(response => {
          this.recognizerSubject.next(
            { ...response }
          );
          this.appState$ = this.userService.addFingerprint$(this.user.uid!, this.recognizerSubject.value?.name!)
            .pipe(
              map(response => {
                this.dataSubject.next(
                  {
                    ...response, data: {
                      fingerprints: [response.data.fingerprint,
                      this.dataSubject.value?.data.fingerprints]
                    }
                  }
                );
                return { dataState: DataState.LOADED, appData: this.dataSubject.value }
              }),
              startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
              catchError((error: string) => {
                return of({ dataState: DataState.ERROR, error })
              })
            );
          return { dataState: DataState.LOADED, appData: this.recognizerSubject.value }
        }),
        startWith({ dataState: DataState.LOADED, appData: this.recognizerSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error });
        })
      );
  }
}

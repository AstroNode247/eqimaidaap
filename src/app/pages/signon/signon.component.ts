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
import { NotificationService } from 'src/app/service/notification.service';
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
  userState$?: Observable<AppState<CustomResponse | null>>;
  fingerState$?: Observable<AppState<RecognizerResponse | null>>;

  private userData = new BehaviorSubject<CustomResponse | null>(null);
  private recognizerSubject = new BehaviorSubject<RecognizerResponse | null>(null);

  private hasRegistered = new BehaviorSubject<boolean>(false);
  hasRegistered$ = this.hasRegistered.asObservable();

  showLoader$ = this.loaderService.loadingAction$;
  showFingerprint$ = this.fingerprintService.showFingerSubject$;

  readonly DataState = DataState;

  constructor(private userService: UserService,
    private fingerprintService: FingerprintService,
    private loaderService: LoaderService,
    private notificationService: NotificationService) { }


  ngOnInit(): void {
    this.userState$ = this.userService.users$
      .pipe(
        map(response => {
          this.userData.next(response)
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
  }

  registerUser() {
    this.loaderService.showLoader();
    this.userState$ = this.userService.save$(this.user)
      .pipe(
        map(response => {
          this.userData.next(
            { ...response, data: { users: [response.data.user, this.userData.value?.data.users] } }
          );
          this.loaderService.hideLoader();
          this.hasRegistered.next(true);
          this.user_info = this.user.uid;
          this.notificationService.setSuccessMessage("Utilisateur enregistré avec succes !");
          return { dataState: DataState.LOADED, appData: this.userData.value }
        }),
        startWith({ dataState: DataState.LOADED }),
        catchError((error: string) => {
          this.loaderService.hideLoader();
          this.notificationService.setErrorMessage(error);
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }

  onAddFingerprint() {
    this.loaderService.showUploadLoader();
    this.fingerState$ = this.fingerprintService.upload$(this.user)
      .pipe(
        map(response => {
          this.fingerprintService.showFingerprint(this.user_info!, response.name);
          this.recognizerSubject.next(
            { ...response }
          );
          this.userState$ = this.userService.addFingerprint$(this.user.uid!, this.recognizerSubject.value?.name!)
            .pipe(
              map(response => {
                return { dataState: DataState.LOADED, appData: response }
              }),
              startWith({ dataState: DataState.LOADED, appData: response }),
              catchError((error: string) => {
                return of({ dataState: DataState.ERROR, error })
              })
            );
          this.notificationService.setSuccessMessage('Empreinte enregistré avec succès');
          this.loaderService.hideUploadLoader();
          return { dataState: DataState.LOADED, appData: this.recognizerSubject.value }
        }),
        startWith({ dataState: DataState.LOADED, appData: this.recognizerSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error });
        })
      );
  }
}

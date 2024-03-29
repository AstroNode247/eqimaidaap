import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { ActionState } from 'src/app/enum/action-state.enum';
import { DataState } from 'src/app/enum/data-state.enum';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-reponse';
import { RecognizerError, RecognizerResponse } from 'src/app/interface/recognizer-response';
import { User } from 'src/app/interface/user';
import { CheckMarkService } from 'src/app/service/check-mark.service';
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
  showCount$ = this.fingerprintService.fingerCountAction$;
  hasSignOn$ = this.fingerprintService.isSignOnAction$;

  readonly DataState = DataState;
  fingerCount = 1;

  constructor(private userService: UserService,
    private fingerprintService: FingerprintService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private checkMarkService: CheckMarkService) { }


  ngOnInit(): void {
    this.fingerCount = 1;
    this.userState$ = this.userService.users$
      .pipe(
        map(response => {
          this.userData.next(response)
          return { dataState: DataState.LOADED, actionState: ActionState.SIGNON, appData: response }
        }),
        startWith({ dataState: DataState.LOADING, actionState: ActionState.SIGNON }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, actionState: ActionState.SIGNON, error })
        })
      )
    this.fingerState$ = this.fingerprintService.version$
      .pipe(
        map(response => {
          return { dataState: DataState.LOADED, actionState: ActionState.SIGNON, appData: response }
        }),
        startWith({ dataState: DataState.LOADING, actionState: ActionState.SIGNON }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, actionState: ActionState.SIGNON, error })
        })
      );
  }

  registerUser() {
    this.loaderService.showLoader();
    this.fingerprintService.signOnAction();
    this.notificationService.clearAllMessage();
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
          this.fingerprintService.setFingerCount(0);
          this.fingerCount = 1;
          this.fingerprintService.initSignOn();
          return {
            dataState: DataState.LOADED, actionState: ActionState.SIGNON,
            appData: this.userData.value
          }
        }),
        startWith({
          dataState: DataState.LOADED,
          actionState: ActionState.SIGNON
        }),
        catchError((error: string) => {
          this.loaderService.hideLoader();
          this.notificationService.setErrorMessage(error);
          return of({ dataState: DataState.ERROR, actionState: ActionState.SIGNON, error })
        })
      )
  }

  onAddFingerprint() {
    this.loaderService.showUploadLoader();
    this.notificationService.clearAllMessage();
    this.fingerState$ = this.fingerprintService.upload$(this.user)
      .pipe(
        map(response => {
          this.fingerprintService.setResponse(response);
          this.fingerprintService.showFingerprint(this.user_info!, response.name);
          this.recognizerSubject.next(
            { ...response }
          );
          this.userState$ = this.userService.addFingerprint$(this.user.uid!, this.recognizerSubject.value?.name!)
            .pipe(
              map(response => {
                return { dataState: DataState.LOADED, actionState: ActionState.SIGNON, appData: response }
              }),
              startWith({ dataState: DataState.LOADED, actionState: ActionState.SIGNON, appData: response }),
              catchError((error: string) => {
                return of({ dataState: DataState.ERROR, actionState: ActionState.SIGNON, error })
              })
            );
          this.fingerprintService.setFingerCount(this.fingerCount++);
          this.notificationService.setSuccessMessage('Empreinte enregistré avec succès');
          this.loaderService.hideUploadLoader();
          this.fingerprintService.isSignOn();
          return { dataState: DataState.LOADED, actionState: ActionState.SIGNON, appData: this.recognizerSubject.value }
        }),
        startWith({ dataState: DataState.LOADED, actionState: ActionState.SIGNON, appData: this.recognizerSubject.value }),
        catchError((error: RecognizerError) => {
          this.fingerprintService.setResponse(null);
          this.loaderService.hideUploadLoader();
          this.notificationService.setErrorMessage(error.message!);
          this.checkMarkService.showFail();
          return of({ dataState: DataState.ERROR, actionState: ActionState.SIGNON, error: error.description! });
        })
      );
  }
}

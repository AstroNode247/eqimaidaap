import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, startWith } from 'rxjs/operators';
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
  selector: 'eq-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  user?: User = { uid: null };
  user_info?: string;
  imageBlob?: string;
  appState$?: Observable<AppState<CustomResponse | null>>;
  fingerState$?: Observable<AppState<RecognizerResponse | null>>;

  private hasSearched = new BehaviorSubject<boolean>(false);
  hasSearched$ = this.hasSearched.asObservable();

  showLoader$ = this.loaderService.loadingAction$;

  readonly DataState = DataState;

  constructor(private userService: UserService,
    private fingerService: FingerprintService,
    private loaderService: LoaderService,
    private notificationService: NotificationService,
    private checkMarkService: CheckMarkService) { }

  ngOnInit(): void {
    this.fingerService.signInAction();
    this.appState$ = this.userService.users$
      .pipe(
        map(response => {
          return { dataState: DataState.LOADED, actionState: ActionState.SIGNIN, appData: response }
        }),
        startWith({ dataState: DataState.LOADING, actionState: ActionState.SIGNIN }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, actionState: ActionState.SIGNIN, error })
        })
      );
    this.fingerState$ = this.fingerService.version$
      .pipe(
        map(response => {
          return { dataState: DataState.LOADED, actionState: ActionState.SIGNIN, appData: response }
        }),
        startWith({ dataState: DataState.LOADING, actionState: ActionState.SIGNIN }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, actionState: ActionState.SIGNIN, error })
        })
      );
  }

  findUser() {
    this.loaderService.showLoader();
    this.appState$ = this.userService.user$(this.user_info!)
      .pipe(
        map(response => {
          this.loaderService.hideLoader();
          this.hasSearched.next(true);
          this.user = response.data.user;
          return { dataState: DataState.LOADED, actionState: ActionState.SIGNIN, appData: response }
        }),
        startWith({ dataState: DataState.LOADING, actionState: ActionState.SIGNIN, }),
        catchError((error: string) => {
          this.loaderService.hideLoader();
          console.log(error);
          this.notificationService.setErrorMessage(error);
          return of({ dataState: DataState.ERROR, actionState: ActionState.SIGNIN, error })
        })
      )
  }

  onAuthenticate() {
    this.loaderService.showUploadLoader();
    this.user = {'uid': this.user_info!}
    this.notificationService.clearAllMessage();
    this.fingerState$ = this.fingerService.sift$(this.user!)
      .pipe(
        map(response => {
          this.fingerService.setResponse(null);
          this.loaderService.hideUploadLoader();
          this.checkMarkService.showSuccess();
          this.fingerService.setResponse(response);
          return { dataState: DataState.LOADED, actionState: ActionState.SIGNIN, appData: response }
        }),
        startWith({ dataState: DataState.LOADED, actionState: ActionState.SIGNIN, }),
        catchError((error: RecognizerError) => {
          this.fingerService.setResponse(null);
          this.notificationService.setErrorMessage(error.message!);
          this.loaderService.hideUploadLoader();
          this.checkMarkService.showFail();
          this.fingerService.setResponse({
            distance: error.distance,
            quality: error.quality
          });
          return of({ dataState: DataState.ERROR, actionState: ActionState.SIGNIN, error: error.description! })
        })
      )
  }

}

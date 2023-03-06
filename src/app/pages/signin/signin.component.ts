import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, startWith } from 'rxjs/operators';
import { DataState } from 'src/app/enum/data-state.enum';
import { AppState } from 'src/app/interface/app-state';
import { CustomResponse } from 'src/app/interface/custom-reponse';
import { RecognizerResponse } from 'src/app/interface/recognizer_response';
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
    this.appState$ = this.userService.users$
      .pipe(
        map(response => {
          return { dataState: DataState.LOADED, appData: response }
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error })
        })
      );
    this.fingerState$ = this.fingerService.version$
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

  findUser() {
    this.loaderService.showLoader();
    this.appState$ = this.userService.user$(this.user_info!)
      .pipe(
        map(response => {
          this.loaderService.hideLoader();
          this.hasSearched.next(true);
          this.user = response.data.user;
          return { dataState: DataState.LOADED, appData: response }
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          this.loaderService.hideLoader();
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }

  onAuthenticate() {
    this.loaderService.showUploadLoader();

    this.fingerState$ = this.fingerService.comparison$(this.user!)
      .pipe(
        map(response => {
          this.fingerService.setResponse(null);
          this.loaderService.hideUploadLoader();
          this.checkMarkService.showSuccess();
          this.fingerService.setResponse(response);
          return { dataState: DataState.LOADED, appData: response }
        }),
        startWith({ dataState: DataState.LOADED }),
        catchError((error: string) => {
          this.fingerService.setResponse(null);
          this.notificationService.setErrorMessage(error);
          this.loaderService.hideUploadLoader();
          this.checkMarkService.showFail();
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }

}

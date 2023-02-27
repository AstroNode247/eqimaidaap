import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loadingAction$ = this.loadingSubject.asObservable();

  private loadingUploadSubject = new BehaviorSubject<boolean>(false);
  loadingUploadAction$ = this.loadingUploadSubject.asObservable();

  showLoader() {
    this.loadingSubject.next(true);
  }

  hideLoader() {
    this.loadingSubject.next(false);
  }

  showUploadLoader() {
    this.loadingUploadSubject.next(true);
  }

  hideUploadLoader() {
    this.loadingUploadSubject.next(false);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CheckMarkService } from './check-mark.service';
import { FingerprintService } from './fingerprint.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loadingAction$ = this.loadingSubject.asObservable();

  private loadingUploadSubject = new BehaviorSubject<boolean>(false);
  loadingUploadAction$ = this.loadingUploadSubject.asObservable();

  constructor(private checkMarkService: CheckMarkService,
    private fingerprintService: FingerprintService) { }

  showLoader() {
    this.loadingSubject.next(true);
  }

  hideLoader() {
    this.loadingSubject.next(false);
  }

  showUploadLoader() {
    this.checkMarkService.hideAll();
    this.fingerprintService.hideFingerprint();
    this.loadingUploadSubject.next(true);
  }

  hideUploadLoader() {
    this.loadingUploadSubject.next(false);
  }
}

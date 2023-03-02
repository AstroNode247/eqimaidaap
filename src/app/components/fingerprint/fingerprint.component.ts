import { Component } from '@angular/core';
import { CheckMarkService } from 'src/app/service/check-mark.service';
import { FingerprintService } from 'src/app/service/fingerprint.service';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'eq-fingerprint',
  templateUrl: './fingerprint.component.html',
  styleUrls: ['./fingerprint.component.css']
})
export class FingerprintComponent {
  showLoader$ = this.loaderService.loadingUploadAction$;
  showSuccess$ = this.checkMarkService.successAction$;
  showFail$ = this.checkMarkService.failAction$;
  showFingerprint$ = this.fingerprintService.showFingerSubject$;

  constructor(private loaderService: LoaderService,
    private checkMarkService: CheckMarkService,
    private fingerprintService: FingerprintService) { }
}

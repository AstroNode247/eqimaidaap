import { Component } from '@angular/core';
import { FingerprintService } from 'src/app/service/fingerprint.service';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'eq-fingerprint',
  templateUrl: './fingerprint.component.html',
  styleUrls: ['./fingerprint.component.css']
})
export class FingerprintComponent {
  constructor(private loaderService: LoaderService,
    private fingerprintService: FingerprintService) { }

  showFingerprint$ = this.fingerprintService.showFingerSubject$;
  showLoader$ = this.loaderService.loadingUploadAction$;
}

import { Component } from '@angular/core';
import { LoaderService } from 'src/app/service/loader.service';

@Component({
  selector: 'eq-fingerprint',
  templateUrl: './fingerprint.component.html',
  styleUrls: ['./fingerprint.component.css']
})
export class FingerprintComponent {
  constructor(private loaderService: LoaderService) { }

  showLoader$ = this.loaderService.loadingUploadAction$;
}

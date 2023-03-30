import { Component, OnInit } from '@angular/core';
import { FingerprintService } from './service/fingerprint.service';

@Component({
  selector: 'eq-root',
  templateUrl: './eq.component.html',
  styleUrls: ['./eq.component.css']
})
export class AppComponent implements OnInit {
  title = 'eqimaidapp';

  constructor(private fingerprintService: FingerprintService) { }

  ngOnInit(): void {
    this.fingerprintService.setFingerCount(10);
  }

}

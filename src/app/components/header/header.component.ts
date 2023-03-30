import { Component } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'eq-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  successMessage$ = this.notificationService.successMessageAction$.pipe(
    tap((message) => {
      if (message) {
        setTimeout(() => {
          this.notificationService.clearAllMessage()
        }, 5000);
      }
    })
  );
  errorMessage$ = this.notificationService.errorMessageAction$;

  constructor(private notificationService: NotificationService) { }
}

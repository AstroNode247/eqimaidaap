import { Component } from '@angular/core';

@Component({
  selector: 'app-signon',
  templateUrl: './signon.component.html',
  styleUrls: ['./signon.component.css']
})
export class SignonComponent {
  id: string = '';

  registerUser() {
    console.log(this.id);
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'eq-signon',
  templateUrl: './signon.component.html',
  styleUrls: ['./signon.component.css']
})
export class SignonComponent {
  id: string = '';

  registerUser() {
    console.log(this.id);
  }
}

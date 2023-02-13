import { Component } from '@angular/core';

@Component({
  selector: 'eq-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  id: string = '';

  findUser() {
    console.log(this.id);
  }

}

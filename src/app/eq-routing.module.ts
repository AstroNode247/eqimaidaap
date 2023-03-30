import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterGuard } from './guard/register.guard';
import { SigninComponent } from './pages/signin/signin.component';
import { SignonComponent } from './pages/signon/signon.component';

const routes: Routes = [
  { path: 'sign-in', component: SigninComponent, canActivate: [RegisterGuard] },
  { path: 'sign-on', component: SignonComponent },
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

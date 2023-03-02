import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './eq-routing.module';
import { AppComponent } from './eq.component';
import { FingerprintComponent } from './components/fingerprint/fingerprint.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SignonComponent } from './pages/signon/signon.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './components/loading/loading.component';
import { AlertSuccessComponent } from './components/alert/alert-success/alert-success.component';
import { AlertErrorComponent } from './components/alert/alert-error/alert-error.component';
import { SuccessMarkComponent } from './components/check-mark/success-mark/success-mark.component';
import { FailMarkComponent } from './components/check-mark/fail-mark/fail-mark.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    SigninComponent,
    HomeComponent,
    FingerprintComponent,
    SignonComponent,
    LoadingComponent,
    AlertSuccessComponent,
    AlertErrorComponent,
    SuccessMarkComponent,
    FailMarkComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

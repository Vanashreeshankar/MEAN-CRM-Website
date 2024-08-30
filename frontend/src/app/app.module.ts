import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';

import { NavbarComponent } from './layout/navbar/navbar.component';
import { MainComponent } from './layout/main/main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientComponent } from './client/client.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { ResetComponent } from './reset/reset.component';
import { TicketsComponent } from './tickets/tickets.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxUiLoaderConfig, NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { TokenInterceptor } from './service/token.interceptor';
import { AddComponent } from './add/add.component';

import { ProfileComponent } from './profile/profile.component';

import { RouteGuardGuard } from './service/route-guard.guard';
import { ClientdetailsComponent } from './clientdetails/clientdetails.component';
import { TicketdetailsComponent } from './ticketdetails/ticketdetails.component';
import { DetailsComponent } from './details/details.component';
import { ClientDialogComponent } from './client-dialog/client-dialog.component';
import { TicketDialogComponent } from './ticket-dialog/ticket-dialog.component';

import { UpdateComponent } from './update/update.component';

const ngx_ui_loader_config: NgxUiLoaderConfig = {
  "bgsColor": "red",
  "bgsOpacity": 0.5,
  "bgsPosition": "bottom-right",
  "bgsSize": 60,
  "bgsType": "rectangle-bounce-party",
  "blur": 5,
  "delay": 0,
  "fastFadeOut": true,
  "fgsColor": "#286497",
  "fgsPosition": "center-center",
  "fgsSize": 60,
  "fgsType": "rectangle-bounce-party",
  "gap": 24,
  "logoPosition": "center-center",
  "logoSize": 120,

  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(242,243,246,0.8)",
  "pbColor": "#294e84",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": true,
  "text": "Loading",
  "textColor": "#FFFFFF",
  "textPosition": "center-center",
  "maxTime": -1,
  "minTime": 300
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    
    NavbarComponent,
    MainComponent,
    DashboardComponent,
    ClientComponent,
    SigninComponent,
    SignupComponent,
    ForgetpasswordComponent,
    ResetComponent,
    TicketsComponent,
    RoutingComponents,
    HomeComponent,
    AddComponent,
    
    ProfileComponent,
    ClientdetailsComponent,
    TicketdetailsComponent,
    DetailsComponent,
    ClientDialogComponent,
    TicketDialogComponent,
  
    UpdateComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxUiLoaderModule.forRoot(ngx_ui_loader_config)

  ],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: "primary" }
  },
  {
    provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
    useValue: { color: "primary" }
  },

  {
    provide: MatDialogRef,
    useValue: {}
  },
  HttpClientModule,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

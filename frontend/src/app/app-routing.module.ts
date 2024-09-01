import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { MainComponent } from './layout/main/main.component';
import { ClientComponent } from './client/client.component';
import { TicketsComponent } from './tickets/tickets.component';
import { ProfileComponent } from './profile/profile.component';
import { ResetComponent } from './reset/reset.component';
import { DetailsComponent } from './details/details.component';
import { RouteGuardGuard } from './service/route-guard.guard';
import { UpdateComponent } from './update/update.component';


const routes: Routes = [

  const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: '**', redirectTo: 'signin' },  // Redirect any undefined routes to /signin

  { path: 'signup', component: SignupComponent },
  { path: 'resetpassword', component: ResetComponent },
  {
    path: '', component: MainComponent,
    children: [
      {
        path: 'dashboard', component: DashboardComponent, canActivate: [RouteGuardGuard],
        data: {
          expectedRole: ['admin', 'user'],
        },
      },
      { path: 'client', component: ClientComponent,  canActivate: [RouteGuardGuard],
      data: {
        expectedRole: ['admin'],
      }, },
      { path: 'ticket', component: TicketsComponent,  canActivate: [RouteGuardGuard],
      data: {
        expectedRole: ['admin'],
      } },
      { path: 'profile', component: ProfileComponent, canActivate: [RouteGuardGuard],
      data: {
        expectedRole: ['user'],
      }, },
      { path: 'details/:clientId', component: DetailsComponent, canActivate: [RouteGuardGuard],
      data: {
        expectedRole: ['admin'],
      } },
    /*  { path: 'update/:_id', component: UpdateComponent, canActivate: [RouteGuardGuard],
      data: {
        expectedRole: ['user', 'admin'],
      }, }*/
    ]
  }




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponents = [HomeComponent,
  SigninComponent,
  SignupComponent,
  DashboardComponent,
  ClientComponent,
  TicketsComponent,
  ProfileComponent,
  ResetComponent,
  DetailsComponent,
  UpdateComponent
]

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CoreRoutingModule } from './core-routing.module';
import { BsNavbarComponent } from './components/bs-navbar/bs-navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from '../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import * as fromAuth from './auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './auth.effects';

@NgModule({
  declarations: [
    BsNavbarComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CoreRoutingModule,
    StoreModule.forFeature('auth', fromAuth.authReducer),
    EffectsModule.forFeature([AuthEffects])
  ],
  exports: [
    BsNavbarComponent
  ]
})
export class CoreModule { }

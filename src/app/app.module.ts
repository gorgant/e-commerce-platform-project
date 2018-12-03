import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { CoreModule } from './core/core.module';
import { ShoppingModule } from './shopping/shopping.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RootStoreModule } from './root-store';
import { AuthModule } from './auth/auth.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule,
    SharedModule,
    // AdminModule,
    // ShoppingModule,
    // AuthModule,
    CoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    AppRoutingModule,
    RootStoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

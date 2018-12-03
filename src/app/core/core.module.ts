import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsNavbarComponent } from './components/bs-navbar/bs-navbar.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    BsNavbarComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    BsNavbarComponent
  ]
})
export class CoreModule { }

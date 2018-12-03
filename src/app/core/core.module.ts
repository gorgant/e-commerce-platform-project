import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsNavbarComponent } from './components/bs-navbar/bs-navbar.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    BsNavbarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([]),
    SharedModule,
  ],
  exports: [
    BsNavbarComponent
  ]
})
export class CoreModule { }

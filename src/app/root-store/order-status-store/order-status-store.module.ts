import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { OrderStatusStoreEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('orderStatus', featureReducer),
    EffectsModule.forFeature([OrderStatusStoreEffects])
  ],
  providers: [OrderStatusStoreEffects]
})
export class OrderStatusStoreModule { }

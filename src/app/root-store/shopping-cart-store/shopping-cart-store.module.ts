import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { ShoppingCartStoreEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('shoppingCart', featureReducer),
    EffectsModule.forFeature([ShoppingCartStoreEffects])
  ],
  providers: [ShoppingCartStoreEffects]
})
export class ShoppingCartStoreModule { }

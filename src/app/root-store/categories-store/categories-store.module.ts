import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureReducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { CategoryStoreEffects } from './effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('categories', featureReducer),
    EffectsModule.forFeature([CategoryStoreEffects])
  ],
  providers: [CategoryStoreEffects]
})
export class CategoriesStoreModule { }

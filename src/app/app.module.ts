import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { NgxElectronModule } from 'ngx-electron';

import { AppComponent } from './app.component';
import { PresDialogComponent } from './pres-dialog/pres-dialog.component';
import { PresentablesComponent } from './presentables/presentables.component';
import { AuthComponent } from './auth/auth.component';
import { BottomsheetComponent } from './bottomsheet/bottomsheet.component';
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, MatBottomSheetRef } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    PresDialogComponent,
    PresentablesComponent,
    AuthComponent,
    BottomsheetComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxElectronModule
  ],
  providers: [
    {provide: MatBottomSheetRef, useValue: {}},
    {provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: {closeOnNavigation: true, autoFocus: false, hasBackdrop: true}}
  ],
  entryComponents: [PresDialogComponent, BottomsheetComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

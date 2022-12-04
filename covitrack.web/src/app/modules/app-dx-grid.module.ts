import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DxDataGridModule
  ],
  exports: [
    DxDataGridModule
  ]
})
export class AppDxGridModule { }

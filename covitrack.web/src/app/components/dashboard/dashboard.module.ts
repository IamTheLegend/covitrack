import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { AppMaterialModule } from '@app/modules/app-material.module';
import { AppDxGridModule } from '@app/modules/app-dx-grid.module';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    AppDxGridModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }

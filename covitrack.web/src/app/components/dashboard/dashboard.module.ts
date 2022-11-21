import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { AppMaterialModule } from '@app/modules/app-material.module';



@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }

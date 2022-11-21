import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppMaterialModule } from '../modules/app-material.module';



@NgModule({
  declarations: [
    AppHeaderComponent,
    AppFooterComponent
  ],
  imports: [
    CommonModule,
    AppMaterialModule
  ],
  exports:[
    AppHeaderComponent,
    AppFooterComponent
  ]
})
export class AppSharedModule { }

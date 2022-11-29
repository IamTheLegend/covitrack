import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppSharedModule } from './shared/app-shared.module';
import { AppMaterialModule } from './modules/app-material.module';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { AppHighchartsModule } from './modules/app-highcharts.module';
import { MapViewComponent } from './components/widgets/map-view/map-view.component';
import { MortalityViewComponent } from './components/widgets/mortality-view/mortality-view.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MapViewComponent,
    MortalityViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppSharedModule,
    AppMaterialModule,
    AppHighchartsModule,
    DashboardModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

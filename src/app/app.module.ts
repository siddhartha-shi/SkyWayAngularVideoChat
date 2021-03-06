import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PcVideoViewComponent } from './pc-video-view/pc-video-view.component';
import { MobileVideoViewComponent } from './mobile-video-view/mobile-video-view.component';

@NgModule({
  declarations: [
    AppComponent,
    PcVideoViewComponent,
    MobileVideoViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

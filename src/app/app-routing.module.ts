import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MobileVideoViewComponent } from './mobile-video-view/mobile-video-view.component';
import { PcVideoViewComponent } from './pc-video-view/pc-video-view.component';

const routes: Routes = [
  { path: '', component: MobileVideoViewComponent },
  { path: 'pc', component: PcVideoViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

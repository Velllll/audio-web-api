import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { TutorialComponent } from './tutorial/tutorial.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'tutorial', component: TutorialComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrumMachineRoutingModule { }

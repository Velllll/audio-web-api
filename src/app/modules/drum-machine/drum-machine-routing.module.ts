import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilesComponent } from './components/files/files.component';
import { PadsComponent } from './components/pads/pads.component';
import { ScalesComponent } from './components/scales/scales.component';
import { MainComponent } from './main/main.component';
import { TutorialComponent } from './tutorial/tutorial.component';

const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'tutorial', component: TutorialComponent, children: [
    {path: 'files', component: FilesComponent},
    {path: 'pads', component: PadsComponent},
    {path: 'scales', component: ScalesComponent},
    {path: '', redirectTo: 'files', pathMatch: 'full'},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrumMachineRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrumMachineRoutingModule } from './drum-machine-routing.module';
import { MainComponent } from './main/main.component';
import { FilesComponent } from './components/files/files.component';
import { PadsComponent } from './components/pads/pads.component';
import { ScalesComponent } from './components/scales/scales.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { StoreService } from './services/store/store.service';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    MainComponent,
    FilesComponent,
    PadsComponent,
    ScalesComponent
  ],
  imports: [
    CommonModule,
    DrumMachineRoutingModule,
    MatExpansionModule,
    MatIconModule
  ],
  providers: [StoreService]
})
export class DrumMachineModule { }

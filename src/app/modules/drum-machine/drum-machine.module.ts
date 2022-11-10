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
import {MatSliderModule} from '@angular/material/slider';
import {MatMenuModule} from '@angular/material/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { SnackBarWarningComponent } from './components/files/snack-bar-warning/snack-bar-warning.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    MainComponent,
    FilesComponent,
    PadsComponent,
    ScalesComponent,
    SnackBarWarningComponent
  ],
  imports: [
    CommonModule,
    DrumMachineRoutingModule,
    MatExpansionModule,
    MatIconModule,
    MatSliderModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    
  ],
  providers: [StoreService]
})
export class DrumMachineModule { }

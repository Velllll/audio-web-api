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
import { ScalesUtilsService } from './services/scales-utils/scales-utils.service';
import { TutorialComponent } from './tutorial/tutorial.component';

@NgModule({
  declarations: [
    MainComponent,
    FilesComponent,
    PadsComponent,
    ScalesComponent,
    SnackBarWarningComponent,
    TutorialComponent,
    FilesComponent,
    PadsComponent,
    ScalesComponent,
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
  providers: [
    StoreService,
    ScalesUtilsService
  ]
})
export class DrumMachineModule { }

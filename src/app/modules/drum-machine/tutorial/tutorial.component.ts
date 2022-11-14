import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ScreenControlService } from '../services/screen-control/screen-control.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

  steps$ = new BehaviorSubject(0)

  screen$ = this.screen.screenSize$


  constructor(
    private screen: ScreenControlService
  ) { }

  ngOnInit(): void {
  }

  nextStep() {
    if(this.steps$.getValue() >= 0 && this.steps$.getValue() < 3) {
      this.steps$.next(this.steps$.getValue() + 1)
    }
  }

  backStep() {
    if(this.steps$.getValue() > 0) {
      this.steps$.next(this.steps$.getValue() - 1)
    }
  }

  getStepName() {
    if(this.steps$.getValue() === 0) {
      return 'Files'
    } else if(this.steps$.getValue() === 1) {
      return 'Pads'
    } else {
      return 'Scales'
    }
  }

}

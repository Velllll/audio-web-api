import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ScreenControlService } from '../services/screen-control/screen-control.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  screen$ = this.screen.screenSize$

  constructor(
    private screen: ScreenControlService
  ) { }

  ngOnInit(): void {
  }

}

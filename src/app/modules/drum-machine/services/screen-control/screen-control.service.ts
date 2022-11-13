import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, map, Observable, startWith } from 'rxjs';

export interface IScreenSize {
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScreenControlService {

  screenSize$!: Observable<IScreenSize>

  constructor() { 
    this.screenSize$ = fromEvent(window, 'resize')
      .pipe(
        startWith({width: window.innerWidth, height: window.innerHeight}),
        map(d => ({width: window.innerWidth, height: window.innerHeight}))
      )
  }
}

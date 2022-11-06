import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ISound {
  name: string;
  src: string;
  pad?: number
}

@Injectable()
export class StoreService {
  kiksArr: ISound[] = [
    {name: 'a', src: 'assets/kicks/a.wav'},
    {name: 'b', src: 'assets/kicks/b.wav'},
    {name: 'c', src: 'assets/kicks/c.wav'},
  ]
  kiks = new BehaviorSubject<ISound[]>(this.kiksArr)

  hatsArr: ISound[] = [
    {name: 'grit hat', src: 'assets/hats/grit hat.wav'},
    {name: 'hat 1', src: 'assets/hats/hat 1.wav'},
  ]
  hats = new BehaviorSubject<ISound[]>(this.hatsArr)

  percsArr: ISound[] = [
    {name: 'perc1', src: 'assets/percs/perc1.wav'},
  ]
  percs = new BehaviorSubject<ISound[]>(this.percsArr)
  
  snaresArr: ISound[] = [
    {name: 'e', src: 'assets/snares/e.wav'},
  ]
  snares = new BehaviorSubject<ISound[]>(this.snaresArr)

  constructor() { }
}

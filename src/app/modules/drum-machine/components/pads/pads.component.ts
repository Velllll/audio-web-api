import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, fromEvent, map } from 'rxjs';
import { IPad, IPads, StoreService } from '../../services/store/store.service';

@Component({
  selector: 'app-pads',
  templateUrl: './pads.component.html',
  styleUrls: ['./pads.component.scss']
})
export class PadsComponent implements OnInit {
  pads$ = new BehaviorSubject<IPad[]>([])

  currentPad$ = new BehaviorSubject<IPad | null>(null)

  constructor(
    private store: StoreService
  ) { }

  ngOnInit(): void {
    const padsInfo: IPad[] = Object.keys(this.store.pads$.getValue())
    .map(padName => {
      const padValues: any = this.store.pads$.getValue()
      return padValues[padName]
    })
    
    this.pads$.next(padsInfo)

    combineLatest([fromEvent(window, 'keydown'), this.pads$]).subscribe(([e, pads]) => {
      const event: any = e
      pads.forEach(pad => {
        const padInfo = this.store.getPadInfo(pad.padName)
        //if src not empty and you press right key 
        if(event.key === pad.padName && padInfo.src) {
          this.store.playSample(padInfo.src)
        }
      })
    })
  }

  palySample(padName: string) {
    const padInfo = this.store.getPadInfo(padName)
    this.currentPad$.next(padInfo)
    //if src not empty
    if(padInfo.src) this.store.playSample(padInfo.src)
  }
}

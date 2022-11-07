import { ChangeDetectionStrategy, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject, combineLatest, fromEvent, map, Observable } from 'rxjs';
import { IPad, IPads, StoreService } from '../../services/store/store.service';

@Component({
  selector: 'app-pads',
  templateUrl: './pads.component.html',
  styleUrls: ['./pads.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PadsComponent implements OnInit {
  pads$: Observable<IPad[]> = this.store.pads$.pipe(
    map(obj => ([obj.q, obj.w, obj.e, obj.a, obj.s, obj.d, obj.z, obj.x, obj.c]))
  )

  currentPad$ = new BehaviorSubject<IPad | null>(null)

  constructor(
    private store: StoreService
  ) { }

  ngOnInit(): void {
    this.pads$.subscribe(console.log)
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

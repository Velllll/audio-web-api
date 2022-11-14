import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INotesStorage, IPlayData, ISettings } from '../../components/scales/scales.component';
import { StoreService } from '../store/store.service';

@Injectable()
export class ScalesUtilsService {

  constructor(
    private store: StoreService
  ) { }

    //////////////////////////////create service!!!//////////////////////////////////////////
  /**
   * for getting y position by name of pad
   * @param padName name of pad
   * @returns y position for scales
   */
   getYPositionForPad(padName: string, settings: ISettings) {
    const values = ['q', 'w', 'e', 'a', 's', 'd', 'z', 'x', 'c']
    return values.findIndex((v) => v === padName) * settings.noteHeight
  }

  getPadFromYPosition(y: number, settings: ISettings) {
    if(y > 0 && y < settings.noteHeight) return 'q'
    else if (y > settings.noteHeight && y < (settings.noteHeight * 2)) return 'w'
    else if (y > (settings.noteHeight * 2) && y < (settings.noteHeight * 3)) return 'e'
    else if (y > (settings.noteHeight * 3) && y < (settings.noteHeight * 4)) return 'a'
    else if (y > (settings.noteHeight * 4) && y < (settings.noteHeight * 5)) return 's'
    else if (y > (settings.noteHeight * 5) && y < (settings.noteHeight * 6)) return 'd'
    else if (y > (settings.noteHeight * 6) && y < (settings.noteHeight * 7)) return 'z'
    else if (y > (settings.noteHeight * 7) && y < (settings.noteHeight * 8)) return 'x'
    else return 'c'
  }

  getXPosForMoveingLine(duration: number, settings: ISettings, curentPos: BehaviorSubject<number>): number {
    if(curentPos.getValue() === 32) curentPos.next(0)
    if(!duration) {
      return settings.marginLeftForName
    } else {
      const pos = curentPos.getValue()
      curentPos.next(curentPos.getValue() + 1)
      return (curentPos.getValue() - 1) * settings.noteWidth * 1 + settings.marginLeftForName
    }
  }

  getRelativeX(x: number, settings: ISettings) {
    return (x - settings.marginLeftForName) / settings.noteWidth
  }

  sortDataForPlaying(notesStorage$: BehaviorSubject<INotesStorage[]>): IPlayData {
    const data: IPlayData = {
      q: {
        src: '',
        volume: 0,
        pos: []
      },
      w: {
        src: '',
        volume: 0,
        pos: []
      },
      e: {
        src: '',
        volume: 0,
        pos: []
      },
      a: {
        src: '',
        volume: 0,
        pos: []
      },
      s: {
        src: '',
        volume: 0,
        pos: []
      },
      d: {
        src: '',
        volume: 0,
        pos: []
      },
      z: {
        src: '',
        volume: 0,
        pos: []
      },
      x: {
        src: '',
        volume: 0,
        pos: []
      },
      c: {
        src: '',
        volume: 0,
        pos: []
      }
    }
    notesStorage$.getValue().forEach(d => {
      const info = this.store.getPadInfo(d.pad)
      data[d.pad as keyof IPlayData] = {src: info.src, volume: info.volume, pos: []}
    })
    notesStorage$.getValue().forEach(d => {
      data[d.pad as keyof IPlayData].pos.push(d.relativeX)
    })
    return data
  }

  /**
  * @returns unique id
  */
  getId() {
    const random = [...Math.random().toString(36).substr(2, 9)].filter(n => !+n && n !== '0').join('')
    return random + random
  }
}

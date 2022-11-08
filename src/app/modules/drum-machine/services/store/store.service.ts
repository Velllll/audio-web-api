import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, map } from 'rxjs';
import { SnackBarWarningComponent } from '../../components/files/snack-bar-warning/snack-bar-warning.component';

export interface ISample {
  sampleName: string;
  src: string;
  sampleId: number;
  pad?: number;
}

export interface IFolder {
  folderID: number;
  name: string;
  samples: ISample[]
}

export interface IPad {
  padName: string;
  src: string;
  sampleName: string;
  volume: number;
}

export interface IPads {
  q: IPad;
  w: IPad;
  e: IPad;
  a: IPad;
  s: IPad;
  d: IPad;
  z: IPad;
  x: IPad;
  c: IPad;
}

@Injectable()
export class StoreService {

  folder$: BehaviorSubject<IFolder[]> = new BehaviorSubject([
    {
      folderID: 713298625,
      name: 'Kiks', 
      samples: [
        {sampleName: 'a', src: 'assets/kicks/a.wav', sampleId: 95720},
        {sampleName: 'b', src: 'assets/kicks/b.wav', sampleId: 720546 },
        {sampleName: 'c', src: 'assets/kicks/c.wav', sampleId: 95723 },
      ]
    },
    {
      folderID: 718625,
      name: 'Hats',
      samples: [
        {sampleName: 'grit hat', src: 'assets/hats/grit hat.wav', sampleId: 9574},
        {sampleName: 'hat 1', src: 'assets/hats/hat 1.wav', sampleId: 9573},
      ]
    },
    {
      folderID: 74325,
      name: 'Percs',
      samples: [
        {sampleName: 'perc1', src: 'assets/percs/perc1.wav', sampleId: 9572},
      ]
    },
    {
      folderID: 712312345,
      name: 'Snares',
      samples: [
        {sampleName: 'e', src: 'assets/snares/e.wav', sampleId: 9571},
        {sampleName: 'dilla snare - Part_1', src: 'assets/snares/dilla snare - Part_1.wav', sampleId: 9571345 },
      ]
    }
  ])

  private pads$: BehaviorSubject<IPads> = new BehaviorSubject({
    q: {
      padName: 'q',
      src: 'assets/kicks/a.wav',
      sampleName: 'a',
      volume: 0.5
    },
    w: {
      padName: 'w',
      src: 'assets/snares/dilla snare - Part_1.wav',
      sampleName: 'dilla snare - Part_1',
      volume: 0.5
    },
    e: {
      padName: 'e',
      src: '',
      sampleName: '',
      volume: 0.5
    },
    a: {
      padName: 'a',
      src: '',
      sampleName: '',
      volume: 0.5
    },
    s: {
      padName: 's',
      src: '',
      sampleName: '',
      volume: 0.5
    },
    d: {
      padName: 'd',
      src: '',
      sampleName: '',
      volume: 0.5
    },
    z: {
      padName: 'z',
      src: '',
      sampleName: '',
      volume: 0.5
    },
    x: {
      padName: 'x',
      src: '',
      sampleName: '',
      volume: 0.5
    },
    c: {
      padName: 'c',
      src: '',
      sampleName: '',
      volume: 0.5
    },
  })

  get padsArr$() {
    return this.pads$.pipe(
      map(obj => ([obj.q, obj.w, obj.e, obj.a, obj.s, obj.d, obj.z, obj.x, obj.c]))
    )
  }

  constructor(
    private snackBar: MatSnackBar
  ) { }

  playSample(src: string, volume: number, padName: string) {
    const audio = new Audio(src)
    audio.volume = volume
    audio.play()
  }
  //this func use in files for play samples in file
  selectSamplePlay(src: string) {
    const audio: HTMLAudioElement = new Audio(src)
    audio.play()
    setTimeout(() => {
      audio.pause()
    }, 5000)
  }

  getPadInfo(padName: string): IPad {
    const pads: any = this.pads$.getValue()
    return pads[padName]
  }

  appointPad(sapmlesSrc: string, pad: string, sampleName: string) {
    //need this couse this.pads[pad] does not work
    const pads: any = this.pads$.getValue()
    //if src don't appoint, appoint src
    if(!pads[pad].src) {
      this.pads$.next({
        ...pads, 
        [pad]: {
          ...pads[pad], 
          src: sapmlesSrc,
          sampleName
        }
      })
    } else {
      this.snackBar.openFromComponent(SnackBarWarningComponent, {
        duration: 2000,
      })
    }
  }

  setVolume(padName: string, volume: number) {
    const pads: any = this.pads$.getValue()
    this.pads$.next({
      ...pads,
      [padName]: {
        ...pads[padName],
        volume
      }
    })
  }
}

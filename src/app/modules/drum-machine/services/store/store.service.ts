import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { SnackBarWarningComponent } from '../../components/files/snack-bar-warning/snack-bar-warning.component';
import { INotesStorage } from '../../components/scales/scales.component';
import { defaultPads } from '../default-presets';

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

  emptyDataForPads: IPads = {
    q: {
      padName: 'q',
      src: '',
      sampleName: '',
      volume: 0.5
    },
    w: {
      padName: 'w',
      src: '',
      sampleName: '',
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
  }

  folder$: BehaviorSubject<IFolder[]> = new BehaviorSubject([
    {
      folderID: 713298625,
      name: 'Kiks', 
      samples: [
        {sampleName: 'kick#1', src: 'assets/kicks/kick_1.wav', sampleId: 95720},
        {sampleName: 'kick#2', src: 'assets/kicks/kick_2.wav', sampleId: 720546 },
        {sampleName: 'kick#3', src: 'assets/kicks/kick_3.wav', sampleId: 95723 },
        {sampleName: 'kick#4', src: 'assets/kicks/kick_4.wav', sampleId: 955323 },
        {sampleName: 'kick#5', src: 'assets/kicks/kick_5.wav', sampleId: 9570023 },
      ]
    },
    {
      folderID: 718625,
      name: 'Hats',
      samples: [
        {sampleName: 'hat#1', src: 'assets/hats/hat_1.wav', sampleId: 1574},
        {sampleName: 'hat#2', src: 'assets/hats/hat_3.wav', sampleId: 74},
        {sampleName: 'hihat#1', src: 'assets/hats/hihat_1.wav', sampleId: 9574},
        {sampleName: 'hihat#2', src: 'assets/hats/hihat_2.wav', sampleId: 94},
        {sampleName: 'hihat#3', src: 'assets/hats/hihat_3.wav', sampleId: 574},
        {sampleName: 'openhihat#1', src: 'assets/hats/openhihat_1.wav', sampleId: 95344},
        {sampleName: 'openhihat#2', src: 'assets/hats/openhihat_2.wav', sampleId: 954323},
      ]
    },
    {
      folderID: 74325,
      name: 'Percs',
      samples: [
        {sampleName: 'perc#1', src: 'assets/percs/perc_1.wav', sampleId: 9572},
        {sampleName: 'perc#2', src: 'assets/percs/perc_2.wav', sampleId: 9500},
        {sampleName: 'perc#3', src: 'assets/percs/perc_3.wav', sampleId: 9551},
      ]
    },
    {
      folderID: 712312345,
      name: 'Snares',
      samples: [
        {sampleName: 'snare#1', src: 'assets/snares/snare_1.wav', sampleId: 9571340 },
        {sampleName: 'snare#2', src: 'assets/snares/snare_2.wav', sampleId: 9571341 },
        {sampleName: 'snare#3', src: 'assets/snares/snare_3.wav', sampleId: 9571342 },
        {sampleName: 'snare#4', src: 'assets/snares/snare_4.wav', sampleId: 9571343 },
        {sampleName: 'snare#5', src: 'assets/snares/snare_5.wav', sampleId: 9571344 },
      ]
    }
  ])

  private pads$: BehaviorSubject<IPads> = new BehaviorSubject(this.emptyDataForPads)

  get padsArr$(): Observable<IPad[]> {
    return this.pads$.pipe(
      map(obj => ([obj.q, obj.w, obj.e, obj.a, obj.s, obj.d, obj.z, obj.x, obj.c]))
    )
  }

  constructor(
    private snackBar: MatSnackBar
  ) { 
    this.loadPadsFromStorage()
  }

  playSample(src: string, volume: number) {
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

  savePadsAndNotes(notes: INotesStorage[]) {
    localStorage.removeItem('notes')
    localStorage.removeItem('pads')
    localStorage.setItem('notes', JSON.stringify(notes))
    localStorage.setItem('pads', JSON.stringify(this.pads$.getValue()))
  }

  loadPadsFromStorage() {
    const pads = localStorage.getItem('pads')
    if(pads) {
      this.pads$.next(JSON.parse(pads))
    } else {
      this.pads$.next(defaultPads)
    }
  }

  clearPads() {
    this.pads$.next(this.emptyDataForPads)
  }
}

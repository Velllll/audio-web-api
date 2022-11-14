import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3'
import { BehaviorSubject, fromEvent, interval, Observable, startWith, Subject, take, takeUntil } from 'rxjs';
import { defaultNotes } from '../../services/default-presets';
import { ScalesUtilsService } from '../../services/scales-utils/scales-utils.service';
import { IPad, StoreService } from '../../services/store/store.service';

export interface INotesStorage {
  noteId: string;
  pad: string;
  relativeX: number
}

export interface IPlayData {
  q: {src: string, volume: number, pos: number[]};
  w: {src: string, volume: number, pos: number[]};
  e: {src: string, volume: number, pos: number[]};
  a: {src: string, volume: number, pos: number[]};
  s: {src: string, volume: number, pos: number[]};
  d: {src: string, volume: number, pos: number[]};
  z: {src: string, volume: number, pos: number[]};
  x: {src: string, volume: number, pos: number[]};
  c: {src: string, volume: number, pos: number[]};
}

export interface ISettings {
  height: number;
  width: number;
  marginLeftForName: number;
  barWidth: number;
  noteHeight: number;
  noteWidth: number;
}

@Component({
  selector: 'app-scales',
  templateUrl: './scales.component.html',
  styleUrls: ['./scales.component.scss'],
})
export class ScalesComponent implements OnInit {
  svg!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>

  settings: ISettings = {
    height: innerHeight * 0.43,
    width: innerWidth * 0.89,
    marginLeftForName: 100,
    // 4 bars and margin-left
    barWidth: (innerWidth * 0.89 - 100) / 4,
    noteHeight: innerHeight * 0.43 / 9,
    noteWidth: (innerWidth * 0.89 - 100) / 32
  }

  pads$: Observable<IPad[]> = this.store.padsArr$

  bpm = 93

  metronomeIsOn: boolean = false

  //for time line 
  curentPos = new BehaviorSubject(0)
  currentXPos$ = new BehaviorSubject(0)

  disablePlayButton = new BehaviorSubject(false)

  stopHandler$ = new Subject<boolean>()

  notesStorage$ = new BehaviorSubject<INotesStorage[]>([])

  constructor(
    private store: StoreService,
    private scalesUtils: ScalesUtilsService
  ) { }

  ngOnInit(): void {
    //appoint width and height to svg element
    this.renderSvg()
    //render notes from storage (do befor renderNotes() func)
    this.loadNotesFromStorage()
    //(do befor renderNotes() func)
    this.renderGElements()
    //add lines to svg
    this.renderLines()
    //add notes to svg
    this.renderNotes()
    //render names
    this.renderPadNames()
    //render time line on start position
    this.renderMovingLineStatic([this.settings.marginLeftForName])

    fromEvent(window, 'resize').subscribe(() => {
      this.settings.height = innerHeight * 0.43
      this.settings.width = innerWidth * 0.89
      this.settings.barWidth = (innerWidth * 0.89 - this.settings.marginLeftForName) / 4
      this.settings.noteHeight = innerHeight * 0.43 / 9
      this.settings.noteWidth = (innerWidth * 0.89 - this.settings.marginLeftForName) / 32
      //update svg size
      this.renderSvg()
      //update lines
      this.renderLines()
      //add notes to svg
      this.renderNotes()
      //render names
      this.renderPadNames()
    })
  }
  /**
   * appoint width and height to svg element 
   */
  renderSvg() {
    this.svg = d3.selectAll('.scales-svg')
    .attr('height', this.settings.height)
    .attr('width', this.settings.width)

    //added option to add new note on dblclick
    this.svg.on('dblclick', d => {
      //if clicked on margine zone woudn't add new note
      if(d.offsetX >= this.settings.marginLeftForName) {
        const y = d.offsetY
        const pad = this.scalesUtils.getPadFromYPosition(y, this.settings)
        //xRelative is x position in numbers of notes width from left edge
        const relativeX = this.scalesUtils.getRelativeX(d.offsetX, this.settings)
        this.renderAndAddNote(this.scalesUtils.getId(), pad, relativeX)
      }
    })
  }

  /**
   * render g containers for lines (render before renderLines() func)
   */
  renderGElements() {
    this.svg
    .append('g')
    .attr('class', 'verticalIntoBars')

    this.svg
    .append('g')
    .attr('class', 'verticalBars')

    this.svg.append('g')
    .attr('class', 'hrPads')

    this.svg.append('g')
    .attr('class', 'moveLine')

    this.svg.append('g')
    .attr('class', 'titlesForPads')

    this.svg.append('g')
    .attr('class', 'notes')
  }

  renderPadNames() {
    const fontSize = this.settings.noteHeight / 2
    const k = this.settings.noteHeight / 2 + fontSize / 2
    const dataOfYPos = [
      {y: k, text: 'Pad q'}, 
      {y: k + this.settings.noteHeight, text: 'Pad w'}, 
      {y: k + (this.settings.noteHeight * 2), text: 'Pad e'}, 
      {y: k + (this.settings.noteHeight * 3), text: 'Pad a'}, 
      {y: k + (this.settings.noteHeight * 4), text: 'Pad s'}, 
      {y: k + (this.settings.noteHeight * 5), text: 'Pad d'}, 
      {y: k + (this.settings.noteHeight * 6), text: 'Pad z'}, 
      {y: k + (this.settings.noteHeight * 7), text: 'Pad x'}, 
      {y: k + (this.settings.noteHeight * 8), text: 'Pad c'}, 
    ]
    d3.selectAll('g.titlesForPads')
      .selectAll('text')
      .data(dataOfYPos)
      .join('text')
      .text(d => d.text)
      .attr('font-size', fontSize)
      .attr('y', d => d.y)
      .attr('x', this.settings.marginLeftForName * 0.2)
    
  }

  renderMovingLineStatic(xPos: number[]) {
    let t: d3.Transition<d3.BaseType, unknown, null, undefined> = d3.transition().duration(60000 / this.bpm * 16).ease(d3.easeLinear)
    if(xPos[0] === this.settings.marginLeftForName) t = d3.transition().duration(0).ease(d3.easeLinear)
    
    d3.selectAll('g.moveLine')
    .selectAll('line.moveLine')
    .data(xPos)
    .join('line')
    .transition(t)
    .attr('class', 'moveLine')
    .attr('x1', d => d)
    .attr('x2', d => d)
    .attr('y1', 0)
    .attr('y2', this.settings.height)
    .attr('stroke', 'rgb(125, 32, 125)')
    .attr('stroke-width', 4)
  }

  renderMovingLine() {
    const timeForOneBar = 60000 / this.bpm
    interval(timeForOneBar / 2).pipe(
      startWith(-1),
      takeUntil(this.stopHandler$)
    ).subscribe(() => {
      this.currentXPos$.next(this.scalesUtils.getXPosForMoveingLine(timeForOneBar, this.settings, this.curentPos))
    })
    interval(60000 / this.bpm * 16).pipe(takeUntil(this.stopHandler$), startWith(0)).subscribe(() => {
      this.renderMovingLineStatic([this.settings.marginLeftForName])
      this.renderMovingLineStatic([this.settings.width])
    })
  }

  renderNotes() {
    this.notesStorage$.getValue().forEach(note => {
      this.renderAndAddNote(note.noteId, note.pad, note.relativeX)
    })
  }

  renderLines() {    
    const dataLines0 = Array(4)
      .fill(1)
      .map((_, i) => this.settings.barWidth * i + this.settings.marginLeftForName)

    d3.selectAll('g.verticalBars')
      .selectAll('line.verticalBars')
      .data(dataLines0)
      .join('line')
      .attr('class', 'verticalBars')
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('x1', (x) => x)
      .attr('x2', (x) => x)
      .attr('y1', 0)
      .attr('y2', this.settings.height)

    const dataLines1 = Array(9)
      .fill(1)
      .map((_, i) => this.settings.noteHeight * i)

    d3.selectAll('g.hrPads')
      .selectAll('line.hrPads')
      .data(dataLines1)
      .join('line')
      .attr('class', 'hrPads')
      .attr('x1', 0)
      .attr('x2', this.settings.width)
      .attr('y1', (y) => y)
     .attr('y2', (y) => y)
     .attr('stroke', 'black')
  
   const dataLines2: number[] = Array(17)
     .fill(1)
      .map((_, i) => this.settings.marginLeftForName + this.settings.barWidth / 4 * i)

    d3.selectAll('g.verticalIntoBars')
     .selectAll('line.verticalIntoBars')
      .data(dataLines2)
      .join('line')
      .attr('class', 'verticalIntoBars')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('x1', (x) => x)
      .attr('x2', (x) => x)
      .attr('y1', 0)
      .attr('y2', this.settings.height)
  }

  renderAndAddNote(noteId: string, pad: string, relativeX: number) {
    relativeX = Math.floor(relativeX)
    const x = relativeX * this.settings.noteWidth + this.settings.marginLeftForName
    //if notesStorage is empty add new notes
    if(!this.notesStorage$.getValue().length) {
      const newNotes = {noteId, pad, relativeX}
      this.notesStorage$.next([...this.notesStorage$.getValue(), newNotes])
    } 
    //check if notesStorage has notes if not push this new note to storage
    if(this.notesStorage$.getValue().length) {
      const isNoteExist = this.notesStorage$.getValue().map(n => n.noteId).includes(noteId)
      if(!isNoteExist) {
        const newNotes = {noteId, pad, relativeX}
        this.notesStorage$.next([...this.notesStorage$.getValue(), newNotes])
      }
    }

    let y: number = this.scalesUtils.getYPositionForPad(pad, this.settings)

    const strokeWidth = 1
    
    this.svg.selectAll('g.notes')
    .selectAll("rect." + noteId)
    .data([{x: x, y: y}])
    .join(`rect`)
      .attr('class', noteId)
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", this.settings.noteWidth - strokeWidth)
      .attr("height", this.settings.noteHeight)
      .attr('fill', 'rgb(125, 32, 125)')
      .attr('stroke', 'black')
      .attr('stroke-width', strokeWidth)
      .call(d3.drag<any, any>()
      .on("drag", (event: any, d: any) => {
        if(event.x > this.settings.marginLeftForName && event.x  < this.settings.width) {
          const floorXPos = Math.floor((event.x - this.settings.marginLeftForName) / this.settings.noteWidth) * this.settings.noteWidth + this.settings.marginLeftForName
          d3.selectAll("rect." + noteId).raise().attr("x", (d.x = floorXPos))
          //updateLocalStorage
          const newData = this.notesStorage$.getValue().map(note => {
            if(note.noteId === noteId)  {
              return {...note, relativeX: Math.floor((event.x - this.settings.marginLeftForName) / this.settings.noteWidth)}
            }
            return note
          })
          this.notesStorage$.next(newData)
        }
      })
    );
    // on dblclick delete note
    this.svg.selectAll("rect." + noteId).on("click", (d) => {
      this.notesStorage$.next(this.notesStorage$.getValue().filter(note => note.noteId !== noteId))
      this.svg.selectAll("rect." + noteId).remove()
    });
  }

  /**
   * starp playing notes and render time line
   */
  start() {
    this.disablePlayButton.next(true)

    const data = this.scalesUtils.sortDataForPlaying(this.notesStorage$)
    this.playSamples(data)

    const timeForOneBar = 60000 / this.bpm
    //play metronome if is on
    if(this.metronomeIsOn) this.playMetronome(timeForOneBar)
    //start rendering time line
    this.renderMovingLine()
  }

  playSamples(data: IPlayData) {
    const timeBar = 60000 / this.bpm / 2
    const values = ['q', 'w', 'e', 'a', 's', 'd', 'z', 'x', 'c']
    //starting all pads
    for(let i = 0; i < 9; i++) {
      interval(timeBar).pipe(takeUntil(this.stopHandler$), startWith(-1)).subscribe(() => {
        const pos = this.curentPos.getValue() !== 32 ? this.curentPos.getValue() : 0
        if(data[values[i] as keyof IPlayData].pos.includes(pos) && data[values[i] as keyof IPlayData].src) {
          this.store.playSample(data[values[i] as keyof IPlayData].src, data[values[i] as keyof IPlayData].volume)
        }
      })
    }
  }

  stop() {
    this.disablePlayButton.next(false)
    this.stopHandler$.next(true)
    this.curentPos.next(0)
    this.renderMovingLineStatic([this.scalesUtils.getXPosForMoveingLine(0, this.settings, this.curentPos)])
  }

  clear() {
    this.notesStorage$.next([])
    this.svg.selectAll('g.notes').selectAll('rect').remove()
    this.stop()
  }

  playMetronome(timeForOneBar: number) {
    const src = 'assets/hats/hat_2.wav'
    this.store.playSample(src, 0.2)
    interval(timeForOneBar).pipe(takeUntil(this.stopHandler$)).subscribe(() => {
      this.store.playSample(src, 0.2)
    })
  }

  record() {
    this.disablePlayButton.next(true)
    this.timeOut()
    const timeForOneBar = 60000 / this.bpm
    setTimeout(() => {
      if(this.metronomeIsOn) this.playMetronome(timeForOneBar)
      this.start()
      fromEvent(window, 'keydown').pipe(takeUntil(this.stopHandler$)).subscribe((e) => {
        let event: any = e
        let pads: IPad[] = []
        this.pads$.pipe(take(1)).subscribe(ps => pads = ps)
        pads.forEach(pad => {
          const padInfo = this.store.getPadInfo(pad.padName)
          //if src not empty and you press right key 
          if(event.key === pad.padName && padInfo.src) {
            this.renderAndAddNote(this.scalesUtils.getId(), padInfo.padName, this.curentPos.getValue() - 1)
          }
        })
      })

    }, timeForOneBar * 3)
  }

  timeOut() {
    const src = 'assets/hats/hat_2.wav'
    this.store.playSample(src, 0.2)
    const timeForOneBar = 60000 / this.bpm
    interval(timeForOneBar).pipe(take(this.metronomeIsOn ? 2 : 3)).subscribe(t => this.store.playSample(src, 0.2))
  }

  increaseBPM() {
    this.bpm++
    this.stop()
  }

  deincreaseBPM() {
    this.bpm--
    this.stop()
  }

  /**
   * save local data from this.notesStorage$ to database or localStorage
   */
  saveStorage() {
    this.store.savePadsAndNotes(this.notesStorage$.getValue())
  }

  loadNotesFromStorage() {
    const jsonData = localStorage.getItem('notes')
    if(jsonData) {
      const notes: INotesStorage[] | null = JSON.parse(jsonData)
      if(notes) this.notesStorage$.next(notes)
    } else {
      //default notes for scales
      this.notesStorage$.next(defaultNotes)
    }
  }
}

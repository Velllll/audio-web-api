import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3'
import { BehaviorSubject, fromEvent, interval, startWith, Subject, takeUntil } from 'rxjs';

export interface INotesStorage {
  noteId: string;
  pad: string;
  relativeX: number
}

@Component({
  selector: 'app-scales',
  templateUrl: './scales.component.html',
  styleUrls: ['./scales.component.scss'],
})
export class ScalesComponent implements OnInit {
  svg!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>

  settings = {
    height: innerHeight * 0.43,
    width: innerWidth * 0.89,
    marginLeftForName: 100,
    // 4 bars and margin-left
    barWidth: (innerWidth * 0.89 - 100) / 4,
    noteHeight: innerHeight * 0.43 / 8,
    noteWidth: (innerWidth * 0.89 - 100) / 32
  }

  bpm = 90

  stopHandler$ = new Subject<boolean>()
  //for time line 
  curentPos = new BehaviorSubject(0)

  notesStorage$ = new BehaviorSubject<INotesStorage[]>([])

  constructor() { }

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

    fromEvent(window, 'resize').subscribe(() => {
      this.settings.height = innerHeight * 0.43
      this.settings.width = innerWidth * 0.89
      this.settings.barWidth = (innerWidth * 0.89 - this.settings.marginLeftForName) / 4
      this.settings.noteHeight = innerHeight * 0.43 / 8
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
        const pad = this.getPadFromYPosition(y)
        //xRelative is x position in numbers of notes width from left edge
        const relativeX = (d.offsetX - this.settings.marginLeftForName) / this.settings.noteWidth
        this.addNote(this.getId(), pad, relativeX)
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

  start() {
    const timeForOneBar = 60000 / this.bpm
    interval(timeForOneBar).pipe(
      startWith(-1),
      takeUntil(this.stopHandler$)
    ).subscribe(() => {
      this.renderMoveLine(timeForOneBar)
    })
  }

  stop() {
    this.stopHandler$.next(true)
    this.curentPos.next(0)
    this.renderMoveLine(0)
  }

  increaseBPM() {
    this.bpm++
    this.stop()
  }

  deincreaseBPM() {
    this.bpm--
    this.stop()
  }

  renderMoveLine(duration: number) {
    let xPos: number = this.getXPosForMoveingLine(duration)
    let d = duration
    if(this.curentPos.getValue() === 1) d = 0
    const transition = d3.transition()
    .duration(d)
    .ease(d3.easeLinear)

    d3.selectAll('g.moveLine')
    .selectAll('line.moveLine')
    .data([xPos])
    .join('line')
    .transition(transition)
    .attr('class', 'moveLine')
    .attr('x1', d => d)
    .attr('x2', d => d)
    .attr('y1', 0)
    .attr('y2', this.settings.height)
    .attr('stroke', 'rgb(125, 32, 125)')
    .attr('stroke-width', 2)
  }

  renderNotes() {
      this.notesStorage$.getValue().forEach(note => {
        this.addNote(note.noteId, note.pad, note.relativeX)
      })
  }

  renderLines() {    
    const dataLines0 = [this.settings.marginLeftForName, this.settings.barWidth + this.settings.marginLeftForName, this.settings.barWidth * 2 + this.settings.marginLeftForName, this.settings.barWidth * 3 + this.settings.marginLeftForName]
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

    const dataLines1 = [this.settings.height / 8 * 1, this.settings.height / 8 * 2, this.settings.height / 8 * 3, this.settings.height / 8 * 4, this.settings.height / 8 * 5, this.settings.height / 8 * 6, this.settings.height / 8 * 7, this.settings.height]
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
    
    const dataLines2: number[] = []
    for(let i = 0; i <= 16; i++) {
      const x = this.settings.marginLeftForName + this.settings.barWidth / 4 * i
      dataLines2.push(x)
    }
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
  /**
   * save local data from this.notesStorage$ to database or localStorage
   */
  saveStorage() {
    localStorage.removeItem('notes')
    localStorage.setItem('notes', JSON.stringify(this.notesStorage$.getValue()))
  }

  loadNotesFromStorage() {
    const jsonData = localStorage.getItem('notes')
    if(jsonData) {
      const notes: INotesStorage[] | null = JSON.parse(jsonData)
      if(notes) this.notesStorage$.next(notes)
    }
  }

  addNote(noteId: string, pad: string, relativeX: number) {
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

    let y: number = this.getYPositionForPad(pad)

    const strokeWidth = 1
    
    this.svg.selectAll("rect." + noteId)
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
        if(event.x > this.settings.marginLeftForName && event.x + this.settings.noteWidth < this.settings.width) {
          d3.selectAll("rect." + noteId).raise().attr("x", (d.x = event.x))
          //updateLocalStorage
          const newData = this.notesStorage$.getValue().map(note => {
            if(note.noteId === noteId)  {
              return {...note, relativeX: (d.x - this.settings.marginLeftForName) / this.settings.noteWidth}
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

  ////////////////////////////////////////////////////////////////////////
  /**
   * for getting y position by name of pad
   * @param padName name of pad
   * @returns y position for scales
   */
  getYPositionForPad(padName: string) {
    let y
    switch (padName) {
      case 'q':
        y = 0
        break;
      case 'w':
        y = this.settings.noteHeight
        break;
      case 'e':
        y = this.settings.noteHeight * 2
        break;
      case 'a':
        y = this.settings.noteHeight * 3
        break;
      case 's':
        y = this.settings.noteHeight * 4
        break;
      case 'd':
        y = this.settings.noteHeight * 5
        break;
      case 'z':
        y = this.settings.noteHeight * 6
        break;
      case 'x':
        y = this.settings.noteHeight * 7
        break;
      case 'c':
        y = this.settings.noteHeight * 8
        break;
      default:
        y = 0
        break;
    }
    return y
  }

  getPadFromYPosition(y: number) {
    if(y > 0 && y < this.settings.noteHeight) return 'q'
    else if (y > this.settings.noteHeight && y < (this.settings.noteHeight * 2)) return 'w'
    else if (y > (this.settings.noteHeight * 2) && y < (this.settings.noteHeight * 3)) return 'e'
    else if (y > (this.settings.noteHeight * 3) && y < (this.settings.noteHeight * 4)) return 'a'
    else if (y > (this.settings.noteHeight * 4) && y < (this.settings.noteHeight * 5)) return 's'
    else if (y > (this.settings.noteHeight * 5) && y < (this.settings.noteHeight * 6)) return 'd'
    else if (y > (this.settings.noteHeight * 6) && y < (this.settings.noteHeight * 7)) return 'z'
    else if (y > (this.settings.noteHeight * 7) && y < (this.settings.noteHeight * 8)) return 'x'
    else return 'c'
  }
  /**
   * generate id
   * @returns unique id
   */
  getId() {
    const random = [...Math.random().toString(36).substr(2, 9)].filter(n => !+n && n !== '0').join('')
    return random + random
  }

  getXPosForMoveingLine(duration: number) {
    if(this.curentPos.getValue() === 33) this.curentPos.next(0)
    if(!duration) {
      return this.settings.marginLeftForName
    } else {
      const pos = this.curentPos.getValue()
      this.curentPos.next(this.curentPos.getValue() + 1)
      return (this.curentPos.getValue() - 1) * this.settings.noteWidth + this.settings.marginLeftForName
    }
  }
}

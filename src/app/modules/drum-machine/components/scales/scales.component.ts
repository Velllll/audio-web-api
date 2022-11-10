import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3'
import { BehaviorSubject, fromEvent } from 'rxjs';

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
export class ScalesComponent implements OnInit, AfterViewInit {
  svg!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>

  settings = {
    height: innerHeight * 0.43,
    width: innerWidth * 0.89,
    marginLeftForName: 100,
    // 4 bars and 70 px for pad name
    barWidth: (innerWidth * 0.89 - 100) / 4,
    noteHeight: innerHeight * 0.43 / 8,
    noteWidth: (innerWidth * 0.89 - 100) / 32
  }

  notesStorage$ = new BehaviorSubject<INotesStorage[]>([])

  constructor() { }

  ngAfterViewInit(): void {
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
    })
  }

  ngOnInit(): void {
    //appoint width and height to svg element
    this.renderSvg()
    //render notes from storage (do befor renderNotes() func)
    this.loadNotesFromStorage()
    //add lines to svg
    this.renderLines()
    //add notes to svg
    this.renderNotes()
  }

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

  renderNotes() {
      this.notesStorage$.getValue().forEach(note => {
        this.addNote(note.noteId, note.pad, note.relativeX)
      })
  }

  renderLines() {
    this.svg.selectAll(".verticalBars").remove()
    this.svg.selectAll(".hrPads").remove()
    this.svg.selectAll(".verticalIntoBars").remove()
    
    this.svg.append('g')
    .attr('class', 'verticalBars')
    .selectAll('line')
    .data([this.settings.marginLeftForName, this.settings.barWidth + this.settings.marginLeftForName, this.settings.barWidth * 2 + this.settings.marginLeftForName, this.settings.barWidth * 3 + this.settings.marginLeftForName])
    .join('line')
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
      .attr('x1', (x) => x)
      .attr('x2', (x) => x)
      .attr('y1', 0)
      .attr('y2', this.settings.height)

    const dataLines1 = [this.settings.height / 8 * 1, this.settings.height / 8 * 2, this.settings.height / 8 * 3, this.settings.height / 8 * 4, this.settings.height / 8 * 5, this.settings.height / 8 * 6, this.settings.height / 8 * 7, this.settings.height]
    this.svg.append('g')
    .attr('class', 'hrPads')
      .selectAll('line')
      .data(dataLines1)
      .join('line')
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
    this.svg.append('g')
    .attr('class', 'verticalIntoBars')
      .selectAll('line')
      .data(dataLines2)
      .join('line')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('x1', (x) => x)
      .attr('x2', (x) => x)
      .attr('y1', 0)
      .attr('y2', this.settings.height)
  }

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
    
    this.svg.selectAll("rect." + noteId)
    .data([{x: x, y: y}])
    .join(`rect`)
      .attr('class', noteId)
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", this.settings.noteWidth)
      .attr("height", this.settings.noteHeight)
      .attr('fill', 'rgb(181, 28, 28)')
      .attr('stroke', 'black')
      .attr('stroke-width', 3)
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
      // console.log(this.notesStorage$.getValue(), this.notesStorage$.getValue().filter(note => note.noteId !== noteId))
      this.notesStorage$.next(this.notesStorage$.getValue().filter(note => note.noteId !== noteId))
      this.svg.selectAll("rect." + noteId).remove()
    });
  }

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

  getId() {
    const random = [...Math.random().toString(36).substr(2, 9)].filter(n => !+n && n !== '0').join('')
    return random + random
  }
}

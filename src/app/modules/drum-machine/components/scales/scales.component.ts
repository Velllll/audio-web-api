import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3'
import { fromEvent } from 'rxjs';
@Component({
  selector: 'app-scales',
  templateUrl: './scales.component.html',
  styleUrls: ['./scales.component.scss']
})
export class ScalesComponent implements OnInit, AfterViewInit {
  svg!: d3.Selection<d3.BaseType, unknown, HTMLElement, any>

  settings = {
    height: innerHeight * 0.43,
    width: innerWidth * 0.89,
    // 4 bars and 70 px for pad name
    barWidth: (innerWidth * 0.89 - 70) / 4,
    noteHeight: innerHeight * 0.43 / 8,
    noteWidth: (innerWidth * 0.89 - 70) / 16
  }

  constructor() { }

  ngAfterViewInit(): void {
    fromEvent(window, 'resize').subscribe(() => {
      this.renderLines()
      this.settings.height = innerHeight * 0.43
      this.settings.width = innerWidth * 0.89
      this.settings.barWidth = (innerWidth * 0.89 - 70) / 4
      this.svg = d3.selectAll('.scales-svg')
        .attr('height', this.settings.height)
        .attr('width', this.settings.width)
    })
  }

  ngOnInit(): void {
    console.log(this.settings.barWidth, this.settings.width)
    this.svg = d3.selectAll('.scales-svg')
      .attr('height', this.settings.height)
      .attr('width', this.settings.width)
    this.renderLines()
    this.addNote('qweads', 'q')
    this.addNote('ghffgh', 'q')
    this.addNote('wrrwe', 'q')
    this.addNote('retgdfgdf', 's')
    this.addNote('bccbvbcv', 'd')
  }

  renderLines() {
    this.svg.selectAll(".padNames").remove()
    this.svg.selectAll(".hrPads").remove()
    
    this.svg.append('g')
    .attr('class', 'padNames')
    .selectAll('line')
    .data([70, this.settings.barWidth + 70, this.settings.barWidth * 2 + 70, this.settings.barWidth * 3 + 70])
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
      const x = 70 + this.settings.barWidth / 4 * i
      dataLines2.push(x)
    }
    this.svg.append('g')
    .attr('class', 'hrPads')
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

  addNote(name: string, pad: string) {
    let x = 71
    let y: number;
    switch (pad) {
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
      
    this.svg.selectAll("rect." + name)
    .data([{x: x, y: y}])
    .join(`rect`)
      .attr('class', name)
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", this.settings.noteWidth)
      .attr("height", this.settings.noteHeight)
      .call(d3.drag<any, any>()
      .on("start", () => {
        // d3.selectAll("rect." + name).attr("stroke", "red");
      })
      .on("drag", (event: any, d: any) => {
        if(event.x > 70 && event.x + this.settings.noteWidth < this.settings.width) {
          d3.selectAll("rect." + name).raise().attr("x", (d.x = event.x))
        }
      })
      .on("end", () => {
        // d3.selectAll("rect." + name).attr("stroke", null);
      }));

    this.svg.selectAll("rect." + name).on("dblclick", (d) => {
      this.svg.selectAll("rect." + name).remove()
    });
  }
}

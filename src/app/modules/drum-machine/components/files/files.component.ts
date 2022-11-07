import { Component, OnInit } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { StoreService } from '../../services/store/store.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  folders$ = this.store.folder$
  
  constructor(
    private store: StoreService
  ) { }

  ngOnInit(): void {

  }

  play(src: string) {
    this.store.playSample(src)
  }

}

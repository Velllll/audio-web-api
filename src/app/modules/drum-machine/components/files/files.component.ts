import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ISound, StoreService } from '../../services/store/store.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  kiks!: Observable<ISound[]> 
  hats!: Observable<ISound[]> 
  percs!: Observable<ISound[]> 
  snares!: Observable<ISound[]> 
  
  constructor(
    private store: StoreService
  ) { }

  ngOnInit(): void {
    this.kiks = this.store.kiks.asObservable()
    this.hats = this.store.hats.asObservable()
    this.percs = this.store.percs.asObservable()
    this.snares = this.store.snares.asObservable()
  }

  play(src: string) {
    const audio = new Audio(src)
    audio.play()
  }

}

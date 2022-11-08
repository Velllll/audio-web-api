import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackBarWarningComponent } from './snack-bar-warning.component';

describe('SnackBarWarningComponent', () => {
  let component: SnackBarWarningComponent;
  let fixture: ComponentFixture<SnackBarWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnackBarWarningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnackBarWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

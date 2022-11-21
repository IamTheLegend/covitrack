import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortalityViewComponent } from './mortality-view.component';

describe('MortalityViewComponent', () => {
  let component: MortalityViewComponent;
  let fixture: ComponentFixture<MortalityViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MortalityViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MortalityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

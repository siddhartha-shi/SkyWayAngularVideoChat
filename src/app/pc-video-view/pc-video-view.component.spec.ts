import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcVideoViewComponent } from './pc-video-view.component';

describe('PcVideoViewComponent', () => {
  let component: PcVideoViewComponent;
  let fixture: ComponentFixture<PcVideoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcVideoViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PcVideoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

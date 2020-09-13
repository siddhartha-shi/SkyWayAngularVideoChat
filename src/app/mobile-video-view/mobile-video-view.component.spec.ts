import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileVideoViewComponent } from './mobile-video-view.component';

describe('MobileVideoViewComponent', () => {
  let component: MobileVideoViewComponent;
  let fixture: ComponentFixture<MobileVideoViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileVideoViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileVideoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

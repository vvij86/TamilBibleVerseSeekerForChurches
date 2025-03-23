import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenDisplayComponent } from './fullscreen-display.component';

describe('FullscreenDisplayComponent', () => {
  let component: FullscreenDisplayComponent;
  let fixture: ComponentFixture<FullscreenDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullscreenDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullscreenDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

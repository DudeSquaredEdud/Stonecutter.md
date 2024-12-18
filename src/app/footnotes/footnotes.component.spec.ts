import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootnotesComponent } from './footnotes.component';

describe('FootnotesComponent', () => {
  let component: FootnotesComponent;
  let fixture: ComponentFixture<FootnotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FootnotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FootnotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

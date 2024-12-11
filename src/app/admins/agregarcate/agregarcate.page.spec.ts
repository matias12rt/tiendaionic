import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarcatePage } from './agregarcate.page';

describe('AgregarcatePage', () => {
  let component: AgregarcatePage;
  let fixture: ComponentFixture<AgregarcatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarcatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

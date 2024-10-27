import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroCliPage } from './registro-cli.page';

describe('RegistroCliPage', () => {
  let component: RegistroCliPage;
  let fixture: ComponentFixture<RegistroCliPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCliPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperadorPage } from './recuperador.page';

describe('RecuperadorPage', () => {
  let component: RecuperadorPage;
  let fixture: ComponentFixture<RecuperadorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

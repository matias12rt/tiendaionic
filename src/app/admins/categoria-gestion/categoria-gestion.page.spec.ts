import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriaGestionPage } from './categoria-gestion.page';

describe('CategoriaGestionPage', () => {
  let component: CategoriaGestionPage;
  let fixture: ComponentFixture<CategoriaGestionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaGestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

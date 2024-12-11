import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriaModificarPage } from './categoria-modificar.page';

describe('CategoriaModificarPage', () => {
  let component: CategoriaModificarPage;
  let fixture: ComponentFixture<CategoriaModificarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaModificarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

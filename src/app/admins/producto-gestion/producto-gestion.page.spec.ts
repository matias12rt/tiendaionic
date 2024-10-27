import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductoGestionPage } from './producto-gestion.page';

describe('ProductoGestionPage', () => {
  let component: ProductoGestionPage;
  let fixture: ComponentFixture<ProductoGestionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoGestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

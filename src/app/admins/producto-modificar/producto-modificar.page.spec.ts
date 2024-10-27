import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductoModificarPage } from './producto-modificar.page';

describe('ProductoModificarPage', () => {
  let component: ProductoModificarPage;
  let fixture: ComponentFixture<ProductoModificarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoModificarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

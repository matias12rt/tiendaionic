import { Component } from '@angular/core';
import { AnimationController, Animation } from '@ionic/angular';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage {
  pedidos = [
    { id: 101, fecha: '2024-11-27', total: 120.50 },
    { id: 102, fecha: '2024-11-26', total: 75.00 },
    { id: 103, fecha: '2024-11-25', total: 180.00 },
  ];

  constructor(private animationCtrl: AnimationController) {}

  // Animación al hacer clic en un pedido
  animatePedido(event: any) {
    const pedidoItem = event.target.closest('ion-item');

    if (pedidoItem) {
      const animation: Animation = this.animationCtrl.create()
        .addElement(pedidoItem)
        .duration(500)
        .keyframes([
          { offset: 0, transform: 'scale(1)', opacity: '1' },
          { offset: 0.5, transform: 'scale(1.1)', opacity: '0.9' },
          { offset: 1, transform: 'scale(1)', opacity: '1' },
        ]);

      animation.play();
    }
  }
}

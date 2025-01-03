import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // Redirigir a la página de inicio después de 5 segundos
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 5000);
  }
}

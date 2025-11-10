import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { RecomRepository, Recomendacion } from '../../data/recom.repository';

@Component({
  selector: 'app-recom-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './recom-page.component.html',
  styleUrls: ['./recom-page.component.css']
})
export class RecomPageComponent {
  recomendaciones: Recomendacion[] = [];

  constructor(private repo: RecomRepository) {
    this.recomendaciones = this.repo.getRecomendaciones();
  }

  iconFor(tipo: Recomendacion['tipo']): string {
    switch (tipo) {
      case 'psicologo': return 'psychology_alt';
      case 'terapeuta': return 'self_improvement';
      case 'linea-ayuda': return 'support_agent';
      default: return 'tips_and_updates';
    }
  }

  colorFor(tipo: Recomendacion['tipo']): 'primary' | 'accent' | 'warn' {
    switch (tipo) {
      case 'psicologo': return 'primary';
      case 'terapeuta': return 'accent';
      case 'linea-ayuda': return 'warn';
      default: return 'primary';
    }
  }

  refresh() {
    this.recomendaciones = this.repo.getRecomendaciones();
  }
}

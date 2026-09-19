import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Enseignant } from '../../../core/models/enseignant.model';
import { EnseignantService } from '../../../core/services/enseignant.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-enseignants-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h2>Enseignants</h2>
          <a *ngIf="auth.aRole('ADMIN')" class="btn btn-primary" routerLink="/enseignants/nouveau">+ Ajouter</a>
        </div>
        <table>
          <thead><tr><th>Nom</th><th>Prénom</th><th>Email</th><th>Spécialité</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let e of enseignants">
              <td>{{ e.nom }}</td>
              <td>{{ e.prenom }}</td>
              <td>{{ e.email }}</td>
              <td>{{ e.specialite || '—' }}</td>
              <td style="display:flex; gap:8px;">
                <a class="btn btn-secondary" [routerLink]="['/enseignants', e.id]">Modifier</a>
                <button *ngIf="auth.aRole('ADMIN')" class="btn btn-danger" (click)="supprimer(e)">Supprimer</button>
              </td>
            </tr>
            <tr *ngIf="enseignants.length === 0">
              <td colspan="5" style="text-align:center; color:#999;">Aucun enseignant</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class EnseignantsListComponent implements OnInit {
  enseignants: Enseignant[] = [];

  constructor(private enseignantService: EnseignantService, public auth: AuthService) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.enseignantService.lister().subscribe(res => this.enseignants = res);
  }

  supprimer(e: Enseignant): void {
    if (!confirm(`Supprimer l'enseignant ${e.prenom} ${e.nom} ?`)) return;
    this.enseignantService.supprimer(e.id!).subscribe(() => this.charger());
  }
}

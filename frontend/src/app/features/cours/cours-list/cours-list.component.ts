import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Cours } from '../../../core/models/cours.model';
import { CoursService } from '../../../core/services/cours.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cours-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h2>Cours</h2>
          <a *ngIf="auth.aRole('ADMIN')" class="btn btn-primary" routerLink="/cours/nouveau">+ Ajouter</a>
        </div>

        <input type="text" placeholder="Rechercher un cours..."
               [(ngModel)]="recherche" (ngModelChange)="rechercher()" name="recherche">

        <table>
          <thead><tr><th>Intitulé</th><th>Crédits</th><th>Enseignant</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let c of coursListe">
              <td>{{ c.intitule }}</td>
              <td>{{ c.credits }}</td>
              <td>{{ c.enseignantNomComplet || '—' }}</td>
              <td style="display:flex; gap:8px;">
                <a class="btn btn-secondary" [routerLink]="['/cours', c.id]">Modifier</a>
                <button *ngIf="auth.aRole('ADMIN')" class="btn btn-danger" (click)="supprimer(c)">Supprimer</button>
              </td>
            </tr>
            <tr *ngIf="coursListe.length === 0">
              <td colspan="4" style="text-align:center; color:#999;">Aucun cours</td>
            </tr>
          </tbody>
        </table>

        <div style="display:flex; gap:8px; margin-top:16px; justify-content:center;" *ngIf="totalPages > 1">
          <button class="btn btn-secondary" [disabled]="page === 0" (click)="changerPage(page - 1)">Précédent</button>
          <span style="align-self:center; font-size:13px;">Page {{ page + 1 }} / {{ totalPages }}</span>
          <button class="btn btn-secondary" [disabled]="page + 1 >= totalPages" (click)="changerPage(page + 1)">Suivant</button>
        </div>
      </div>
    </div>
  `
})
export class CoursListComponent implements OnInit {
  coursListe: Cours[] = [];
  recherche = '';
  page = 0;
  totalPages = 0;

  constructor(private coursService: CoursService, public auth: AuthService) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.coursService.lister(this.recherche, this.page).subscribe(res => {
      this.coursListe = res.content;
      this.totalPages = res.totalPages;
    });
  }

  rechercher(): void {
    this.page = 0;
    this.charger();
  }

  changerPage(p: number): void {
    this.page = p;
    this.charger();
  }

  supprimer(c: Cours): void {
    if (!confirm(`Supprimer le cours ${c.intitule} ?`)) return;
    this.coursService.supprimer(c.id!).subscribe(() => this.charger());
  }
}

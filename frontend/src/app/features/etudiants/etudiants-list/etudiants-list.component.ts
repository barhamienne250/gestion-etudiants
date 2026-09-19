import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Etudiant } from '../../../core/models/etudiant.model';
import { EtudiantService } from '../../../core/services/etudiant.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-etudiants-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h2>Étudiants</h2>
          <a *ngIf="auth.aRole('ADMIN')" class="btn btn-primary" routerLink="/etudiants/nouveau">+ Ajouter</a>
        </div>

        <input type="text" placeholder="Rechercher par nom ou prénom..."
               [(ngModel)]="recherche" (ngModelChange)="rechercher()" name="recherche">

        <table>
          <thead>
            <tr><th>Nom</th><th>Prénom</th><th>Email</th><th>Filière</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of etudiants">
              <td>{{ e.nom }}</td>
              <td>{{ e.prenom }}</td>
              <td>{{ e.email }}</td>
              <td>{{ e.filiere || '—' }}</td>
              <td style="display:flex; gap:8px;">
                <a class="btn btn-secondary" [routerLink]="['/etudiants', e.id]">Modifier</a>
                <button *ngIf="auth.aRole('ADMIN')" class="btn btn-danger" (click)="supprimer(e)">Supprimer</button>
              </td>
            </tr>
            <tr *ngIf="etudiants.length === 0">
              <td colspan="5" style="text-align:center; color:#999;">Aucun étudiant trouvé</td>
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
export class EtudiantsListComponent implements OnInit {
  etudiants: Etudiant[] = [];
  recherche = '';
  page = 0;
  totalPages = 0;

  constructor(private etudiantService: EtudiantService, public auth: AuthService) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.etudiantService.lister(this.recherche, this.page).subscribe(res => {
      this.etudiants = res.content;
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

  supprimer(e: Etudiant): void {
    if (!confirm(`Supprimer l'étudiant ${e.prenom} ${e.nom} ?`)) return;
    this.etudiantService.supprimer(e.id!).subscribe(() => this.charger());
  }
}

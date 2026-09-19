import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Etudiant } from '../../../core/models/etudiant.model';
import { Cours } from '../../../core/models/cours.model';
import { Inscription } from '../../../core/models/inscription.model';
import { EtudiantService } from '../../../core/services/etudiant.service';
import { CoursService } from '../../../core/services/cours.service';
import { InscriptionService } from '../../../core/services/inscription.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-inscriptions-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="card" *ngIf="auth.aRole('ADMIN', 'ENSEIGNANT')">
        <h2>Nouvelle inscription</h2>
        <p class="error" *ngIf="erreur">{{ erreur }}</p>
        <form [formGroup]="formulaire" (ngSubmit)="inscrire()" style="display:flex; gap:12px; align-items:flex-end;">
          <div style="flex:1;">
            <label>Étudiant</label>
            <select formControlName="etudiantId">
              <option [ngValue]="null">— Choisir —</option>
              <option *ngFor="let e of etudiants" [ngValue]="e.id">{{ e.prenom }} {{ e.nom }}</option>
            </select>
          </div>
          <div style="flex:1;">
            <label>Cours</label>
            <select formControlName="coursId">
              <option [ngValue]="null">— Choisir —</option>
              <option *ngFor="let c of coursListe" [ngValue]="c.id">{{ c.intitule }}</option>
            </select>
          </div>
          <button class="btn btn-primary" type="submit" style="margin-bottom:12px;" [disabled]="formulaire.invalid">
            Inscrire
          </button>
        </form>
      </div>

      <div class="card">
        <h2>Inscriptions par étudiant</h2>
        <label>Choisir un étudiant</label>
        <select (change)="chargerParEtudiant($any($event.target).value)">
          <option value="">— Sélectionner —</option>
          <option *ngFor="let e of etudiants" [value]="e.id">{{ e.prenom }} {{ e.nom }}</option>
        </select>

        <table style="margin-top:12px;" *ngIf="inscriptionsEtudiant.length > 0">
          <thead><tr><th>Cours</th><th>Date</th><th>Note</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let i of inscriptionsEtudiant">
              <td>{{ i.coursIntitule }}</td>
              <td>{{ i.dateInscription }}</td>
              <td>
                <input type="number" step="0.5" min="0" max="20" style="width:70px; margin:0;"
                       [value]="i.note ?? ''" (change)="noter(i, $any($event.target).value)">
              </td>
              <td>
                <button *ngIf="auth.aRole('ADMIN')" class="btn btn-danger" (click)="annuler(i)">Retirer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class InscriptionsListComponent implements OnInit {
  etudiants: Etudiant[] = [];
  coursListe: Cours[] = [];
  inscriptionsEtudiant: Inscription[] = [];
  erreur = '';

  formulaire = this.fb.group({
    etudiantId: [null as number | null, Validators.required],
    coursId: [null as number | null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private etudiantService: EtudiantService,
    private coursService: CoursService,
    private inscriptionService: InscriptionService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.etudiantService.lister('', 0, 200).subscribe(res => this.etudiants = res.content);
    this.coursService.lister('', 0, 200).subscribe(res => this.coursListe = res.content);
  }

  inscrire(): void {
    if (this.formulaire.invalid) return;
    this.erreur = '';
    const valeur = this.formulaire.getRawValue() as { etudiantId: number; coursId: number };

    this.inscriptionService.inscrire(valeur).subscribe({
      next: () => {
        this.formulaire.reset();
        if (this.inscriptionsEtudiant.length && this.inscriptionsEtudiant[0].etudiantId === valeur.etudiantId) {
          this.chargerParEtudiant(String(valeur.etudiantId));
        }
      },
      error: (err) => this.erreur = err?.error?.message || "Erreur lors de l'inscription",
    });
  }

  chargerParEtudiant(id: string): void {
    if (!id) { this.inscriptionsEtudiant = []; return; }
    this.inscriptionService.listerParEtudiant(Number(id)).subscribe(res => this.inscriptionsEtudiant = res);
  }

  noter(inscription: Inscription, valeur: string): void {
    const note = valeur === '' ? null : Number(valeur);
    if (note === null) return;
    this.inscriptionService.noter(inscription.id!, note).subscribe(maj => {
      inscription.note = maj.note;
    });
  }

  annuler(inscription: Inscription): void {
    if (!confirm('Retirer cette inscription ?')) return;
    this.inscriptionService.annuler(inscription.id!).subscribe(() => {
      this.inscriptionsEtudiant = this.inscriptionsEtudiant.filter(i => i.id !== inscription.id);
    });
  }
}

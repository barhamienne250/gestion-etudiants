import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EtudiantService } from '../../../core/services/etudiant.service';
import { InscriptionService } from '../../../core/services/inscription.service';
import { Inscription } from '../../../core/models/inscription.model';

@Component({
  selector: 'app-etudiant-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container" style="max-width: 560px;">
      <div class="card">
        <h2>{{ id ? 'Modifier' : 'Nouvel' }} étudiant</h2>
        <p class="error" *ngIf="erreur">{{ erreur }}</p>
        <form [formGroup]="formulaire" (ngSubmit)="soumettre()">
          <label>Nom</label>
          <input type="text" formControlName="nom">

          <label>Prénom</label>
          <input type="text" formControlName="prenom">

          <label>Email</label>
          <input type="email" formControlName="email">

          <label>Date de naissance</label>
          <input type="date" formControlName="dateNaissance">

          <label>Filière</label>
          <input type="text" formControlName="filiere" placeholder="Génie Logiciel, Réseaux...">

          <div style="display:flex; gap:10px;">
            <button class="btn btn-primary" type="submit" [disabled]="formulaire.invalid">Enregistrer</button>
            <button class="btn btn-secondary" type="button" (click)="retour()">Annuler</button>
          </div>
        </form>
      </div>

      <div class="card" *ngIf="id">
        <h3>Cours suivis</h3>
        <table>
          <thead><tr><th>Cours</th><th>Date d'inscription</th><th>Note</th></tr></thead>
          <tbody>
            <tr *ngFor="let i of inscriptions">
              <td>{{ i.coursIntitule }}</td>
              <td>{{ i.dateInscription }}</td>
              <td>{{ i.note ?? '—' }}</td>
            </tr>
            <tr *ngIf="inscriptions.length === 0">
              <td colspan="3" style="text-align:center; color:#999;">Aucune inscription</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class EtudiantFormComponent implements OnInit {
  id: number | null = null;
  erreur = '';
  inscriptions: Inscription[] = [];

  formulaire = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dateNaissance: [''],
    filiere: [''],
  });

  constructor(
    private fb: FormBuilder,
    private etudiantService: EtudiantService,
    private inscriptionService: InscriptionService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param && param !== 'nouveau') {
      this.id = Number(param);
      this.etudiantService.obtenir(this.id).subscribe(e => this.formulaire.patchValue(e as any));
      this.inscriptionService.listerParEtudiant(this.id).subscribe(res => this.inscriptions = res);
    }
  }

  soumettre(): void {
    if (this.formulaire.invalid) return;
    const valeur = this.formulaire.getRawValue() as any;

    const obs = this.id
      ? this.etudiantService.modifier(this.id, valeur)
      : this.etudiantService.creer(valeur);

    obs.subscribe({
      next: () => this.router.navigate(['/etudiants']),
      error: (err) => this.erreur = err?.error?.message || "Erreur lors de l'enregistrement",
    });
  }

  retour(): void {
    this.router.navigate(['/etudiants']);
  }
}

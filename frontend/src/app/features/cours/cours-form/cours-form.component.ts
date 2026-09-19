import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursService } from '../../../core/services/cours.service';
import { EnseignantService } from '../../../core/services/enseignant.service';
import { Enseignant } from '../../../core/models/enseignant.model';

@Component({
  selector: 'app-cours-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container" style="max-width: 560px;">
      <div class="card">
        <h2>{{ id ? 'Modifier' : 'Nouveau' }} cours</h2>
        <p class="error" *ngIf="erreur">{{ erreur }}</p>
        <form [formGroup]="formulaire" (ngSubmit)="soumettre()">
          <label>Intitulé</label>
          <input type="text" formControlName="intitule">

          <label>Description</label>
          <textarea formControlName="description" rows="3"></textarea>

          <label>Crédits</label>
          <input type="number" formControlName="credits" min="1">

          <label>Enseignant</label>
          <select formControlName="enseignantId">
            <option [ngValue]="null">— Non assigné —</option>
            <option *ngFor="let e of enseignants" [ngValue]="e.id">{{ e.prenom }} {{ e.nom }}</option>
          </select>

          <div style="display:flex; gap:10px;">
            <button class="btn btn-primary" type="submit" [disabled]="formulaire.invalid">Enregistrer</button>
            <button class="btn btn-secondary" type="button" (click)="retour()">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CoursFormComponent implements OnInit {
  id: number | null = null;
  erreur = '';
  enseignants: Enseignant[] = [];

  formulaire = this.fb.group({
    intitule: ['', Validators.required],
    description: [''],
    credits: [3, [Validators.required, Validators.min(1)]],
    enseignantId: [null as number | null],
  });

  constructor(
    private fb: FormBuilder,
    private coursService: CoursService,
    private enseignantService: EnseignantService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.enseignantService.lister().subscribe(res => this.enseignants = res);

    const param = this.route.snapshot.paramMap.get('id');
    if (param && param !== 'nouveau') {
      this.id = Number(param);
      this.coursService.obtenir(this.id).subscribe(c => this.formulaire.patchValue(c as any));
    }
  }

  soumettre(): void {
    if (this.formulaire.invalid) return;
    const valeur = this.formulaire.getRawValue() as any;

    const obs = this.id
      ? this.coursService.modifier(this.id, valeur)
      : this.coursService.creer(valeur);

    obs.subscribe({
      next: () => this.router.navigate(['/cours']),
      error: (err) => this.erreur = err?.error?.message || "Erreur lors de l'enregistrement",
    });
  }

  retour(): void {
    this.router.navigate(['/cours']);
  }
}

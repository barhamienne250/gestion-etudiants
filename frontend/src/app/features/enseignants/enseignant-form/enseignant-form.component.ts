import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnseignantService } from '../../../core/services/enseignant.service';

@Component({
  selector: 'app-enseignant-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container" style="max-width: 560px;">
      <div class="card">
        <h2>{{ id ? 'Modifier' : 'Nouvel' }} enseignant</h2>
        <p class="error" *ngIf="erreur">{{ erreur }}</p>
        <form [formGroup]="formulaire" (ngSubmit)="soumettre()">
          <label>Nom</label>
          <input type="text" formControlName="nom">
          <label>Prénom</label>
          <input type="text" formControlName="prenom">
          <label>Email</label>
          <input type="email" formControlName="email">
          <label>Spécialité</label>
          <input type="text" formControlName="specialite" placeholder="Développement Web, Réseaux...">
          <div style="display:flex; gap:10px;">
            <button class="btn btn-primary" type="submit" [disabled]="formulaire.invalid">Enregistrer</button>
            <button class="btn btn-secondary" type="button" (click)="retour()">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EnseignantFormComponent implements OnInit {
  id: number | null = null;
  erreur = '';

  formulaire = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    specialite: [''],
  });

  constructor(
    private fb: FormBuilder,
    private enseignantService: EnseignantService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param && param !== 'nouveau') {
      this.id = Number(param);
      this.enseignantService.obtenir(this.id).subscribe(e => this.formulaire.patchValue(e as any));
    }
  }

  soumettre(): void {
    if (this.formulaire.invalid) return;
    const valeur = this.formulaire.getRawValue() as any;

    const obs = this.id
      ? this.enseignantService.modifier(this.id, valeur)
      : this.enseignantService.creer(valeur);

    obs.subscribe({
      next: () => this.router.navigate(['/enseignants']),
      error: (err) => this.erreur = err?.error?.message || "Erreur lors de l'enregistrement",
    });
  }

  retour(): void {
    this.router.navigate(['/enseignants']);
  }
}

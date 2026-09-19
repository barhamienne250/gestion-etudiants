import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container" style="max-width: 420px;">
      <div class="card">
        <h2>Créer un compte</h2>
        <p class="error" *ngIf="erreur">{{ erreur }}</p>
        <form [formGroup]="formulaire" (ngSubmit)="soumettre()">
          <label>Nom complet</label>
          <input type="text" formControlName="nom">

          <label>Email</label>
          <input type="email" formControlName="email">

          <label>Mot de passe</label>
          <input type="password" formControlName="motDePasse">

          <label>Rôle</label>
          <select formControlName="role">
            <option value="ETUDIANT">Étudiant</option>
            <option value="ENSEIGNANT">Enseignant</option>
            <option value="ADMIN">Administrateur</option>
          </select>

          <button class="btn btn-primary" type="submit" [disabled]="formulaire.invalid || chargement">
            {{ chargement ? 'Création...' : 'Créer le compte' }}
          </button>
        </form>
        <p style="margin-top:16px; font-size:13px;">
          Déjà un compte ? <a routerLink="/connexion">Se connecter</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  erreur = '';
  chargement = false;

  formulaire = this.fb.group({
    nom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    role: ['ETUDIANT', Validators.required],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  soumettre(): void {
    if (this.formulaire.invalid) return;
    this.chargement = true;
    this.erreur = '';

    this.auth.register(this.formulaire.getRawValue() as any).subscribe({
      next: () => this.router.navigate(['/etudiants']),
      error: (err) => {
        this.chargement = false;
        this.erreur = err?.error?.message || "Erreur lors de la création du compte";
      }
    });
  }
}

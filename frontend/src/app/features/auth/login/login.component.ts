import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container" style="max-width: 420px;">
      <div class="card">
        <h2>Connexion</h2>
        <p class="error" *ngIf="erreur">{{ erreur }}</p>
        <form [formGroup]="formulaire" (ngSubmit)="soumettre()">
          <label>Email</label>
          <input type="email" formControlName="email" placeholder="admin@gestion-etudiants.sn">

          <label>Mot de passe</label>
          <input type="password" formControlName="motDePasse" placeholder="admin123">

          <button class="btn btn-primary" type="submit" [disabled]="formulaire.invalid || chargement">
            {{ chargement ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
        <p style="margin-top:16px; font-size:13px;">
          Pas encore de compte ? <a routerLink="/inscription">Créer un compte</a>
        </p>
        <p style="margin-top:8px; font-size:12px; color:#888;">
          Compte admin par défaut : admin&#64;gestion-etudiants.sn / admin123
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  erreur = '';
  chargement = false;

  formulaire = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  soumettre(): void {
    if (this.formulaire.invalid) return;
    this.chargement = true;
    this.erreur = '';

    this.auth.login(this.formulaire.getRawValue() as any).subscribe({
      next: () => this.router.navigate(['/etudiants']),
      error: (err) => {
        this.chargement = false;
        this.erreur = err?.error?.message || 'Identifiants invalides';
      }
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar" *ngIf="auth.estConnecte()">
      <div class="brand">Gestion Étudiants</div>
      <div class="liens">
        <a routerLink="/etudiants">Étudiants</a>
        <a routerLink="/enseignants">Enseignants</a>
        <a routerLink="/cours">Cours</a>
        <a routerLink="/inscriptions">Inscriptions</a>
      </div>
      <div class="utilisateur">
        <span class="badge" [ngClass]="'badge-' + (auth.utilisateurConnecte()?.role || '').toLowerCase()">
          {{ auth.utilisateurConnecte()?.role }}
        </span>
        <span class="nom">{{ auth.utilisateurConnecte()?.nom }}</span>
        <button class="btn btn-secondary" (click)="deconnexion()">Déconnexion</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex; align-items: center; gap: 24px;
      padding: 12px 24px; background: #1f2d3d; color: #fff;
    }
    .brand { font-weight: 700; font-size: 16px; }
    .liens { display: flex; gap: 16px; flex: 1; }
    .liens a { color: #d6dee8; text-decoration: none; font-size: 14px; }
    .liens a:hover { color: #fff; }
    .utilisateur { display: flex; align-items: center; gap: 10px; }
    .nom { font-size: 13px; color: #d6dee8; }
  `]
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}

  deconnexion(): void {
    this.auth.logout();
    this.router.navigate(['/connexion']);
  }
}

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, RoleUtilisateur } from '../models/user.model';

const CLE_TOKEN = 'ge_token';
const CLE_UTILISATEUR = 'ge_utilisateur';

@Injectable({ providedIn: 'root' })
export class AuthService {

  utilisateurConnecte = signal<AuthResponse | null>(this.lireUtilisateurStocke());

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(tap(res => this.enregistrerSession(res)));
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload)
      .pipe(tap(res => this.enregistrerSession(res)));
  }

  logout(): void {
    localStorage.removeItem(CLE_TOKEN);
    localStorage.removeItem(CLE_UTILISATEUR);
    this.utilisateurConnecte.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(CLE_TOKEN);
  }

  estConnecte(): boolean {
    return !!this.getToken();
  }

  aRole(...roles: RoleUtilisateur[]): boolean {
    const u = this.utilisateurConnecte();
    return !!u && roles.includes(u.role);
  }

  private enregistrerSession(res: AuthResponse): void {
    localStorage.setItem(CLE_TOKEN, res.token);
    localStorage.setItem(CLE_UTILISATEUR, JSON.stringify(res));
    this.utilisateurConnecte.set(res);
  }

  private lireUtilisateurStocke(): AuthResponse | null {
    const brut = localStorage.getItem(CLE_UTILISATEUR);
    return brut ? JSON.parse(brut) as AuthResponse : null;
  }
}

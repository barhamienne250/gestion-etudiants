import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Inscription } from '../models/inscription.model';

@Injectable({ providedIn: 'root' })
export class InscriptionService {
  private base = `${environment.apiUrl}/inscriptions`;

  constructor(private http: HttpClient) {}

  listerParEtudiant(etudiantId: number): Observable<Inscription[]> {
    return this.http.get<Inscription[]>(`${this.base}/etudiant/${etudiantId}`);
  }

  listerParCours(coursId: number): Observable<Inscription[]> {
    return this.http.get<Inscription[]>(`${this.base}/cours/${coursId}`);
  }

  inscrire(payload: { etudiantId: number; coursId: number }): Observable<Inscription> {
    return this.http.post<Inscription>(this.base, payload);
  }

  noter(id: number, note: number): Observable<Inscription> {
    return this.http.patch<Inscription>(`${this.base}/${id}/note`, { note });
  }

  annuler(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}

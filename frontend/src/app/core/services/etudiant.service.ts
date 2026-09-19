import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Etudiant } from '../models/etudiant.model';
import { PageResult } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class EtudiantService {
  private base = `${environment.apiUrl}/etudiants`;

  constructor(private http: HttpClient) {}

  lister(recherche = '', page = 0, taille = 10): Observable<PageResult<Etudiant>> {
    let params = new HttpParams().set('page', page).set('size', taille);
    if (recherche) params = params.set('recherche', recherche);
    return this.http.get<PageResult<Etudiant>>(this.base, { params });
  }

  obtenir(id: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.base}/${id}`);
  }

  creer(e: Etudiant): Observable<Etudiant> {
    return this.http.post<Etudiant>(this.base, e);
  }

  modifier(id: number, e: Etudiant): Observable<Etudiant> {
    return this.http.put<Etudiant>(`${this.base}/${id}`, e);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}

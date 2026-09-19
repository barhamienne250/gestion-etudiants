import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cours } from '../models/cours.model';
import { PageResult } from '../models/page.model';

@Injectable({ providedIn: 'root' })
export class CoursService {
  private base = `${environment.apiUrl}/cours`;

  constructor(private http: HttpClient) {}

  lister(recherche = '', page = 0, taille = 10): Observable<PageResult<Cours>> {
    let params = new HttpParams().set('page', page).set('size', taille);
    if (recherche) params = params.set('recherche', recherche);
    return this.http.get<PageResult<Cours>>(this.base, { params });
  }

  obtenir(id: number): Observable<Cours> {
    return this.http.get<Cours>(`${this.base}/${id}`);
  }

  creer(c: Cours): Observable<Cours> {
    return this.http.post<Cours>(this.base, c);
  }

  modifier(id: number, c: Cours): Observable<Cours> {
    return this.http.put<Cours>(`${this.base}/${id}`, c);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}

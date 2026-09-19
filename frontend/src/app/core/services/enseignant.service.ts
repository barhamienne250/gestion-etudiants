import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Enseignant } from '../models/enseignant.model';

@Injectable({ providedIn: 'root' })
export class EnseignantService {
  private base = `${environment.apiUrl}/enseignants`;

  constructor(private http: HttpClient) {}

  lister(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(this.base);
  }

  obtenir(id: number): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.base}/${id}`);
  }

  creer(e: Enseignant): Observable<Enseignant> {
    return this.http.post<Enseignant>(this.base, e);
  }

  modifier(id: number, e: Enseignant): Observable<Enseignant> {
    return this.http.put<Enseignant>(`${this.base}/${id}`, e);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}

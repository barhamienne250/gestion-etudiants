export type RoleUtilisateur = 'ADMIN' | 'ENSEIGNANT' | 'ETUDIANT';

export interface AuthResponse {
  token: string;
  nom: string;
  email: string;
  role: RoleUtilisateur;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  nom: string;
  email: string;
  motDePasse: string;
  role: RoleUtilisateur;
}

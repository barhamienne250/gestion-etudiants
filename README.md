# Gestion Étudiants

Application de gestion scolaire (étudiants, enseignants, cours, inscriptions) réalisée
dans le cadre du mémoire "Automatisation du déploiement d'applications conteneurisées
via un pipeline CI/CD et un orchestrateur Kubernetes".

## Stack technique

- **Backend** : Spring Boot 3.3 (Java 21), Spring Security + JWT, Spring Data JPA, MySQL 8
- **Frontend** : Angular 17 (composants standalone), formulaires réactifs
- **Conteneurisation** : Docker + Docker Compose
- **CI/CD & orchestration** : voir le mémoire — Jenkins/GitHub Actions, Kubernetes/Minikube

## Fonctionnalités

- Authentification (inscription/connexion) avec JWT, 3 rôles : `ADMIN`, `ENSEIGNANT`, `ETUDIANT`
- CRUD Étudiants, Enseignants, Cours (paginé, recherche)
- Inscriptions : inscrire un étudiant à un cours, noter, consulter les cours suivis
- Droits par rôle : lecture ouverte aux utilisateurs connectés, création/modification
  réservée à `ADMIN`/`ENSEIGNANT`, suppression réservée à `ADMIN`

## Lancer avec Docker Compose (recommandé)

```bash
docker compose up --build
```

- Frontend : http://localhost:4200
- Backend (API) : http://localhost:8080/api
- Swagger : http://localhost:8080/swagger-ui.html
- MySQL : localhost:3306 (root / root)

Un compte administrateur est créé automatiquement au premier démarrage :
**admin@gestion-etudiants.sn / admin123**

## Lancer en local (sans Docker)

### Backend

```bash
cd backend
# Nécessite Java 21 et Maven. Sans MySQL local, utilisez le profil "dev" (base H2 en mémoire) :
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend

```bash
cd frontend
npm install
npm start
# http://localhost:4200 — l'app appelle http://localhost:8080/api (voir src/environments)
```

## Structure du projet

```
gestion-etudiants/
├── backend/     API REST Spring Boot (voir backend/README ci-dessous)
├── frontend/    Application Angular
└── docker-compose.yml
```

### Backend — arborescence

```
src/main/java/sn/ipd/gestionetudiants/
├── config/        SecurityConfig, DataInitializer
├── security/      JwtUtil, JwtAuthFilter
├── model/         User, Etudiant, Enseignant, Cours, Inscription, Role
├── repository/    Spring Data JPA
├── dto/           Objets d'échange (requêtes/réponses)
├── service/       Logique métier
├── controller/    Contrôleurs REST (/api/...)
└── exception/     Gestion globale des erreurs
```

### Frontend — arborescence

```
src/app/
├── core/          services, guards, intercepteur JWT, modèles TypeScript
├── features/      auth, etudiants, enseignants, cours, inscriptions
└── shared/        navbar
```

## Prochaines étapes suggérées (pipeline CI/CD)

Ce dépôt correspond au chapitre 3 du mémoire (implémentation). Pour la suite :
1. Pousser le code sur GitHub et configurer le webhook Jenkins (ou GitHub Actions).
2. Le Jenkinsfile/pipeline peut reprendre les Dockerfiles déjà présents dans `backend/`
   et `frontend/` pour construire et publier les images.
3. Adapter les manifestes Kubernetes (annexe E du mémoire) avec ces mêmes images.

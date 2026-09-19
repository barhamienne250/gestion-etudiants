# Déploiement sur Minikube

Ce dossier contient les manifestes Kubernetes pour déployer l'application
gestion-etudiants sur un cluster Minikube local, sans registre Docker distant
(on charge les images directement dans Minikube avec `minikube image load`).

## Prérequis

- Docker Desktop (déjà installé)
- Minikube : https://minikube.sigs.k8s.io/docs/start/
- kubectl : généralement installé avec Minikube ou Docker Desktop

Vérifier :
```powershell
minikube version
kubectl version --client
```

## Étape 1 — Démarrer Minikube

```powershell
minikube start --driver=docker
```

## Étape 2 — Construire les images Docker

Depuis la racine du projet (là où se trouve docker-compose.yml) :

```powershell
docker build -t gestion-etudiants-backend:latest ./backend
docker build -t gestion-etudiants-frontend:latest ./frontend
```

## Étape 3 — Charger les images dans Minikube

Minikube utilise son propre moteur Docker interne ; il ne voit pas les images
que tu viens de construire sur ta machine tant qu'elles n'y sont pas chargées :

```powershell
minikube image load gestion-etudiants-backend:latest
minikube image load gestion-etudiants-frontend:latest
```

## Étape 4 — Appliquer les manifestes

```powershell
kubectl apply -f k8s/
```

Cela crée, dans l'ordre : le namespace `gestion-etudiants`, le secret et le
volume MySQL, le Deployment/Service MySQL, le ConfigMap/Secret/Deployment/
Service backend, puis le Deployment/Service frontend.

## Étape 5 — Vérifier que tout tourne

```powershell
kubectl get pods -n gestion-etudiants
kubectl get svc -n gestion-etudiants
```

Attends que tous les pods soient `Running` (le backend peut prendre 30-60s
pour se connecter à MySQL au démarrage).

## Étape 6 — Accéder à l'application

Le frontend est exposé en `NodePort`. Pour l'ouvrir directement dans le
navigateur par défaut :

```powershell
minikube service frontend -n gestion-etudiants
```

Cette commande ouvre automatiquement l'URL (ex: http://127.0.0.1:xxxxx)
correspondant au frontend.

## Commandes utiles

```powershell
# Voir les logs du backend
kubectl logs -n gestion-etudiants -l app=backend --tail=100 -f

# Redémarrer le backend après un nouveau build d'image
docker build -t gestion-etudiants-backend:latest ./backend
minikube image load gestion-etudiants-backend:latest
kubectl rollout restart deployment/backend -n gestion-etudiants

# Scaler le backend (démontrer l'auto-scaling manuel pour le mémoire)
kubectl scale deployment/backend -n gestion-etudiants --replicas=3

# Tout supprimer
kubectl delete namespace gestion-etudiants
```

## Notes pour le mémoire

- `imagePullPolicy: Never` sur backend/frontend car les images sont chargées
  localement dans Minikube (pas de registre distant) — voir chapitre 3.4.
- Le Service MySQL est en `ClusterIP: None` (headless), pratique courante pour
  une base à réplique unique adressée par son nom DNS interne (`mysql`).
- Les probes `readinessProbe`/`livenessProbe` du backend illustrent
  l'auto-réparation (auto-healing) évoquée au chapitre 1.5.
- Pour simuler le Rolling Update (chapitre 3.4) : modifie le tag de l'image,
  reconstruis, recharge-la dans Minikube, puis lance
  `kubectl rollout restart deployment/backend -n gestion-etudiants` et observe
  `kubectl rollout status deployment/backend -n gestion-etudiants`.

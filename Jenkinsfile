// Pipeline CI du monorepo gestion-etudiants (backend Spring Boot + frontend Angular)
// REGISTRY et MANIFESTS_REPO sont des variables globales définies dans Jenkins (JCasC).
pipeline {
  agent any
  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }
  environment {
    BACKEND_NAME  = 'gestion-etudiants-backend'
    FRONTEND_NAME = 'gestion-etudiants-frontend'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build backend') {
      steps { sh 'docker build -t $REGISTRY/$BACKEND_NAME:$BUILD_NUMBER ./backend' }
    }
    stage('Build frontend') {
      steps { sh 'docker build -t $REGISTRY/$FRONTEND_NAME:$BUILD_NUMBER ./frontend' }
    }
    stage('Push images') {
      steps {
        sh '''
          docker push $REGISTRY/$BACKEND_NAME:$BUILD_NUMBER
          docker push $REGISTRY/$FRONTEND_NAME:$BUILD_NUMBER
        '''
      }
    }
    stage('Update manifests repo') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'github-token',
                                          usernameVariable: 'GIT_USER',
                                          passwordVariable: 'GIT_TOKEN')]) {
          sh '''
            set -e
            : "${MANIFESTS_REPO:?Variable globale MANIFESTS_REPO absente de Jenkins}"
            rm -rf manifests-repo
            git clone https://${GIT_USER}:${GIT_TOKEN}@${MANIFESTS_REPO} manifests-repo
            cd manifests-repo
            sed -i "s|image: .*|image: $REGISTRY/$BACKEND_NAME:$BUILD_NUMBER|"  07-backend-deployment.yaml
            sed -i "s|image: .*|image: $REGISTRY/$FRONTEND_NAME:$BUILD_NUMBER|" 09-frontend-deployment.yaml
            git config user.email "jenkins@ci.local"
            git config user.name  "jenkins"
            if git diff --quiet; then
              echo "Aucun changement de manifeste."
            else
              git commit -am "ci: backend + frontend -> $BUILD_NUMBER"
              git push origin HEAD:main
            fi
          '''
        }
      }
    }
  }
  post {
    always {
      sh 'rm -rf manifests-repo || true'
      sh 'docker image prune -f || true'
    }
  }
}

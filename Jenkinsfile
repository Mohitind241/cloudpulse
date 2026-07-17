pipeline {
    agent any

    tools {
        jdk 'jdk17'
    }

    environment {
        SCANNER_HOME      = tool 'sonar-scanner'
        DOCKER_IMAGE      = "mohitdocker241/cloudpulse"
        DOCKER_TAG        = "${BUILD_NUMBER}"
        SONAR_PROJECT_KEY = "CloudPulse"
    }

    stages {

        // ─────────────────────────────────────────────────────────
        stage('🔍 Git Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-token',
                    url: 'https://github.com/YOUR_GITHUB_USERNAME/cloudpulse.git'
                echo "✅ Code checked out from GitHub"
            }
        }

        // ─────────────────────────────────────────────────────────
        stage('🛡️ SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh """
                        ${SCANNER_HOME}/bin/sonar-scanner \
                            -Dsonar.projectName=${SONAR_PROJECT_KEY} \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions=**/bin/**,**/obj/**,**/wwwroot/lib/**
                    """
                }
                echo "✅ SonarQube analysis complete"
            }
        }

        // ─────────────────────────────────────────────────────────
        stage('✅ Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: false
                }
                echo "✅ Quality Gate check complete"
            }
        }

        // ─────────────────────────────────────────────────────────
        stage('🔎 OWASP Dependency Check') {
            steps {
                dependencyCheck additionalArguments: '''
                    --scan ./
                    --disableYarnAudit
                    --disableNodeAudit
                    --format HTML
                    --format XML
                ''', odcInstallation: 'DP-Check'

                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
                echo "✅ OWASP scan complete — report published"
            }
        }

        // ─────────────────────────────────────────────────────────
        stage('📁 Trivy File System Scan') {
            steps {
                sh """
                    trivy fs . \
                        --format table \
                        --exit-code 0 \
                        --severity HIGH,CRITICAL \
                        -o trivyfs.txt
                """
                archiveArtifacts artifacts: 'trivyfs.txt'
                echo "✅ Trivy filesystem scan complete"
            }
        }

        // ─────────────────────────────────────────────────────────
        stage('🐳 Docker Build') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker-cred', url: 'https://index.docker.io/v1/') {
                        sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                        sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                        echo "✅ Docker image built: ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    }
                }
            }
        }

        // ─────────────────────────────────────────────────────────
        stage('🔐 Trivy Image Scan') {
            steps {
                sh """
                    trivy image \
                        --format table \
                        --exit-code 0 \
                        --severity HIGH,CRITICAL \
                        ${DOCKER_IMAGE}:latest \
                        -o trivyimage.txt
                """
                archiveArtifacts artifacts: 'trivyimage.txt'
                echo "✅ Trivy image scan complete"
            }
        }

        // ─────────────────────────────────────────────────────────
        stage('📤 Docker Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker-cred', url: 'https://index.docker.io/v1/') {
                        sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                        sh "docker push ${DOCKER_IMAGE}:latest"
                        echo "✅ Image pushed to DockerHub: mohitdocker241/cloudpulse"
                    }
                }
            }
        }

        // ─────────────────────────────────────────────────────────
        stage('🚀 Deploy to Docker') {
            steps {
                sh """
                    docker stop cloudpulse 2>/dev/null || true
                    docker rm cloudpulse   2>/dev/null || true
                    docker run -d \
                        --name cloudpulse \
                        --restart unless-stopped \
                        -p 80:80 \
                        ${DOCKER_IMAGE}:latest
                """
                echo "✅ App deployed and running on port 80"
            }
        }

        // ─────────────────────────────────────────────────────────
        stage('☸️ Deploy to Kubernetes') {
            when {
                branch 'main'
            }
            steps {
                sh "kubectl apply -f k8s-deployment.yaml"
                sh "kubectl rollout status deployment/cloudpulse --timeout=120s"
                sh "kubectl get pods -l app=cloudpulse"
                echo "✅ Kubernetes deployment complete — 2 replicas running"
            }
        }

    }

    // ─────────────────────────────────────────────────────────────
    post {
        always {
            echo "🏁 Pipeline finished — Build #${BUILD_NUMBER}"
            cleanWs()
        }
        success {
            echo """
            ╔══════════════════════════════════════╗
            ║  ✅ PIPELINE SUCCESS — CloudPulse     ║
            ║  Image: mohitdocker241/cloudpulse      ║
            ║  Built by: Mohit                       ║
            ╚══════════════════════════════════════╝
            """
        }
        failure {
            echo "❌ Pipeline FAILED — Check console output above"
        }
    }
}

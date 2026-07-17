# ☁️ CloudPulse — Real-Time DevSecOps Pipeline

![CloudPulse](https://img.shields.io/badge/Project-CloudPulse-6366f1?style=for-the-badge&logo=cloud&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-mohitdocker241-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Deployed-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-CI/CD-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

> **A production-grade Real-Time Infrastructure Monitoring Web Application built with .NET 8, deployed through a fully automated DevSecOps CI/CD pipeline.**

---

## 🎯 Project Overview

**CloudPulse** is a real-time infrastructure monitoring dashboard that I designed and built from scratch as part of my DevSecOps portfolio. The project demonstrates:

- 🔐 **Security-first pipeline** — every stage includes automated vulnerability scanning
- 🐳 **Containerized deployment** — Docker + Kubernetes with rolling updates
- ☁️ **Cloud-native architecture** — Hosted on AWS EC2 (Ubuntu 22.04)
- ⚙️ **Fully automated CI/CD** — Jenkins declarative pipeline with 7 stages

---

## 🏗️ Architecture

```
Developer (git push)
        │
        ▼
   ┌─────────────────────────────────────────────────────────┐
   │                  Jenkins Pipeline                        │
   │                                                          │
   │  ① Git Checkout → ② SonarQube → ③ Quality Gate         │
   │       → ④ OWASP → ⑤ Trivy FS → ⑥ Docker Build         │
   │       → ⑦ Trivy Image → ⑧ Docker Push → ⑨ K8s Deploy  │
   └─────────────────────────────────────────────────────────┘
        │
        ▼
   DockerHub (mohitdocker241/cloudpulse:latest)
        │
        ▼
   Kubernetes Cluster (2–5 Replicas via HPA)
        │
        ▼
   CloudPulse Live ✅
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **App** | .NET 8 Razor Pages | Web application framework |
| **CI/CD** | Jenkins (Declarative Pipeline) | Build & deployment automation |
| **Code Quality** | SonarQube | Static analysis, quality gate |
| **Security** | OWASP Dependency Check | CVE vulnerability scanning |
| **Security** | Trivy | Docker image & filesystem scanning |
| **Container** | Docker (multi-stage build) | Containerization |
| **Registry** | DockerHub (mohitdocker241) | Image storage & versioning |
| **Orchestration** | Kubernetes | Container orchestration, HPA |
| **Cloud** | AWS EC2 (t2.large, Ubuntu 22.04) | Infrastructure |

---

## 🔒 Security Gates in the Pipeline

```
Stage 1 → SonarQube      → Detects code smells, security hotspots, bugs
Stage 2 → OWASP DC       → Scans NuGet packages for known CVEs
Stage 3 → Trivy FS Scan  → Scans repository files for misconfigurations
Stage 4 → Trivy Image    → Scans Docker image layers for OS vulnerabilities
```

**All 4 security gates must be green before production deployment.**

---

## 🚀 Pipeline Stages (Jenkinsfile)

| Stage | Tool | Description |
|-------|------|-------------|
| `Git Checkout` | Jenkins | Pull latest code from GitHub |
| `SonarQube Analysis` | SonarQube | Static code analysis |
| `Quality Gate` | SonarQube | Block if code quality fails |
| `OWASP Dependency Check` | OWASP DC | Scan dependencies for CVEs |
| `Trivy FS Scan` | Trivy | Filesystem vulnerability scan |
| `Docker Build` | Docker | Build multi-stage image |
| `Trivy Image Scan` | Trivy | Image layer vulnerability scan |
| `Docker Push` | DockerHub | Push to `mohitdocker241/cloudpulse` |
| `Kubernetes Deploy` | kubectl | Rolling deployment (2 replicas) |

---

## 📦 Docker

```bash
# Pull and run the image
docker pull mohitdocker241/cloudpulse:latest
docker run -d -p 80:80 --name cloudpulse mohitdocker241/cloudpulse:latest

# Access at http://localhost
```

---

## ☸️ Kubernetes Deployment

```bash
# Deploy to your cluster
kubectl apply -f k8s-deployment.yaml

# Check pods
kubectl get pods -l app=cloudpulse

# Check service
kubectl get svc cloudpulse-service
```

**Features:**
- ✅ Rolling deployment (zero downtime)
- ✅ 2 replicas minimum
- ✅ HPA: auto-scales to 5 pods at 70% CPU
- ✅ Liveness + readiness probes

---

## 🖥️ Infrastructure Setup

```bash
# 1. Launch AWS EC2: Ubuntu 22.04, t2.large, 30GB storage
# 2. Open ports: 22 (SSH), 8080 (Jenkins), 9000 (SonarQube), 80 (App)

# 3. Install Jenkins
sudo apt update && sudo apt install openjdk-17-jdk -y
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
    https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
    https://pkg.jenkins.io/debian-stable binary/ | \
    sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update && sudo apt install jenkins -y
sudo systemctl start jenkins

# 4. Install Docker
sudo apt install docker.io -y
sudo usermod -aG docker $USER jenkins
sudo chmod 777 /var/run/docker.sock

# 5. Run SonarQube
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community

# 6. Install Trivy
sudo apt install wget apt-transport-https gnupg lsb-release -y
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key \
    | gpg --dearmor | sudo tee /usr/share/keyrings/trivy.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] \
    https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" \
    | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt update && sudo apt install trivy -y
```

---

## 📋 Jenkins Plugins Required

- Eclipse Temurin Installer
- SonarQube Scanner
- OWASP Dependency-Check
- Docker + Docker Pipeline
- Pipeline Stage View

---

## 📁 Project Structure

```
cloudpulse/
├── Pages/
│   ├── Index.cshtml          # Dashboard homepage
│   ├── Index.cshtml.cs
│   ├── Metrics.cshtml        # Live metrics page
│   ├── Metrics.cshtml.cs
│   ├── About.cshtml          # About / project info page
│   └── About.cshtml.cs
├── wwwroot/
│   ├── css/site.css          # Dark premium UI stylesheet
│   └── js/site.js            # Live metrics simulation
├── Dockerfile                # Multi-stage build
├── Jenkinsfile               # CI/CD pipeline (9 stages)
├── k8s-deployment.yaml       # K8s Deployment + Service + HPA
├── CloudPulse.csproj
├── Program.cs
└── appsettings.json
```

---

## 👨‍💻 Built by Mohit

**DevOps Engineer** — passionate about automating everything and building secure, scalable infrastructure.

- 🐳 DockerHub: [mohitdocker241](https://hub.docker.com/u/mohitdocker241)
- 💼 Skills: AWS · Docker · Kubernetes · Jenkins · DevSecOps · CI/CD · Linux

> *"Ship fast, ship secure."*

---

## 📄 License

MIT License — Feel free to use this project as a learning reference.

---

<div align="center">
  <strong>⭐ If this project helped you, please give it a star!</strong><br/>
  Built with ❤️ by <strong>Mohit</strong>
</div>

# ITPilot Deployment Guide

## Overview

This guide covers deploying ITPilot to production using Docker and Kubernetes.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Docker Deployment](#docker-deployment)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [Cloud Providers](#cloud-providers)
6. [Monitoring & Logging](#monitoring--logging)
7. [Backup & Recovery](#backup--recovery)

## Prerequisites

### System Requirements
- Docker 24.0+
- Docker Compose 2.20+
- Kubernetes 1.28+ (for production)
- kubectl CLI
- Helm 3.0+

### External Services
- PostgreSQL 16
- Redis 7
- SMTP server (for emails)
- OpenAI API key
- Payment gateway accounts (Stripe, Paystack, Flutterwave)

## Development Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd ITPilot
```

### 2. Environment Configuration

**Backend** (`backend/.env`):
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

**Frontend** (`frontend/.env.local`):
```bash
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your configuration
```

### 3. Start Development Environment

Using Make:
```bash
make build
make up
make migrate
make createsuperuser
```

Or manually:
```bash
docker-compose up -d
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Admin: http://localhost:8000/admin

## Docker Deployment

### 1. Build Images
```bash
docker build -t itpilot/backend:latest ./backend
docker build -t itpilot/frontend:latest ./frontend
```

### 2. Push to Registry
```bash
docker tag itpilot/backend:latest registry.example.com/itpilot/backend:latest
docker tag itpilot/frontend:latest registry.example.com/itpilot/frontend:latest

docker push registry.example.com/itpilot/backend:latest
docker push registry.example.com/itpilot/frontend:latest
```

### 3. Deploy with Docker Compose
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Kubernetes Deployment

### 1. Prepare Cluster
```bash
# Create namespace
kubectl apply -f kubernetes/namespace.yaml

# Create secrets (update with actual values first)
kubectl apply -f kubernetes/secrets.yaml

# Create ConfigMap
kubectl apply -f kubernetes/configmap.yaml
```

### 2. Deploy Database & Cache
```bash
kubectl apply -f kubernetes/postgres-deployment.yaml
kubectl apply -f kubernetes/redis-deployment.yaml
```

### 3. Deploy Application
```bash
# Backend
kubectl apply -f kubernetes/backend-deployment.yaml

# Frontend
kubectl apply -f kubernetes/frontend-deployment.yaml

# Ingress
kubectl apply -f kubernetes/ingress.yaml
```

### 4. Verify Deployment
```bash
kubectl get pods -n itpilot
kubectl get services -n itpilot
kubectl get ingress -n itpilot
```

### 5. Database Migration
```bash
kubectl exec -it -n itpilot $(kubectl get pod -n itpilot -l app=backend -o jsonpath='{.items[0].metadata.name}') -- python manage.py migrate
```

### 6. Create Superuser
```bash
kubectl exec -it -n itpilot $(kubectl get pod -n itpilot -l app=backend -o jsonpath='{.items[0].metadata.name}') -- python manage.py createsuperuser
```

## Cloud Providers

### AWS (EKS)

1. **Create EKS Cluster**:
```bash
eksctl create cluster --name itpilot-cluster --region us-east-1 --nodes 3
```

2. **Install Load Balancer Controller**:
```bash
helm repo add eks https://aws.github.io/eks-charts
helm install aws-load-balancer-controller eks/aws-load-balancer-controller -n kube-system
```

3. **Deploy Application**:
Follow Kubernetes deployment steps above.

### Google Cloud (GKE)

1. **Create GKE Cluster**:
```bash
gcloud container clusters create itpilot-cluster --num-nodes=3 --zone=us-central1-a
```

2. **Configure kubectl**:
```bash
gcloud container clusters get-credentials itpilot-cluster --zone=us-central1-a
```

3. **Deploy Application**:
Follow Kubernetes deployment steps above.

### Azure (AKS)

1. **Create AKS Cluster**:
```bash
az aks create --resource-group itpilot-rg --name itpilot-cluster --node-count 3
```

2. **Get Credentials**:
```bash
az aks get-credentials --resource-group itpilot-rg --name itpilot-cluster
```

3. **Deploy Application**:
Follow Kubernetes deployment steps above.

## Monitoring & Logging

### Prometheus & Grafana

1. **Install Prometheus**:
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
```

2. **Access Grafana**:
```bash
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
```

### ELK Stack

1. **Install Elasticsearch**:
```bash
helm repo add elastic https://helm.elastic.co
helm install elasticsearch elastic/elasticsearch -n logging --create-namespace
```

2. **Install Kibana**:
```bash
helm install kibana elastic/kibana -n logging
```

## Backup & Recovery

### Database Backup

**Automated Backup (CronJob)**:
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
  namespace: itpilot
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:16-alpine
            command:
            - /bin/sh
            - -c
            - pg_dump -h postgres-service -U itpilot_user itpilot_db > /backup/backup-$(date +%Y%m%d-%H%M%S).sql
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          restartPolicy: OnFailure
```

**Manual Backup**:
```bash
kubectl exec -n itpilot postgres-0 -- pg_dump -U itpilot_user itpilot_db > backup.sql
```

**Restore**:
```bash
kubectl exec -i -n itpilot postgres-0 -- psql -U itpilot_user itpilot_db < backup.sql
```

## SSL/TLS Configuration

### Using cert-manager

1. **Install cert-manager**:
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

2. **Create ClusterIssuer**:
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@itpilot.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

## Scaling

### Horizontal Pod Autoscaling

HPA is already configured in deployment files. Monitor scaling:
```bash
kubectl get hpa -n itpilot
kubectl describe hpa backend-hpa -n itpilot
```

### Manual Scaling
```bash
kubectl scale deployment backend -n itpilot --replicas=5
kubectl scale deployment frontend -n itpilot --replicas=3
```

## Troubleshooting

### View Logs
```bash
kubectl logs -f -n itpilot deployment/backend
kubectl logs -f -n itpilot deployment/frontend
```

### Debug Pod
```bash
kubectl exec -it -n itpilot <pod-name> -- /bin/sh
```

### Check Events
```bash
kubectl get events -n itpilot --sort-by='.lastTimestamp'
```

## Security Checklist

- [ ] Use secrets for sensitive data
- [ ] Enable RBAC
- [ ] Configure network policies
- [ ] Use TLS/SSL certificates
- [ ] Regular security updates
- [ ] Implement pod security policies
- [ ] Enable audit logging
- [ ] Configure firewalls
- [ ] Use private container registry
- [ ] Regular backups

## Performance Optimization

1. **Enable Redis caching**
2. **Use CDN for static files**
3. **Database query optimization**
4. **Connection pooling**
5. **Gzip compression**
6. **Image optimization**
7. **Lazy loading**
8. **Code splitting**

## Support

For deployment issues:
- Email: devops@itpilot.com
- Slack: #deployment-support
- Documentation: https://docs.itpilot.com

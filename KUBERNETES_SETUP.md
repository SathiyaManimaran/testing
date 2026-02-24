# Kubernetes Setup Guide

This guide will help you set up Kubernetes for deploying your Angular + Spring Boot application.

## Option 1: Local Kubernetes (Recommended for Development)

### Docker Desktop (Easiest)
1. Open **Docker Desktop**
2. Go to **Settings → Kubernetes**
3. Check **Enable Kubernetes**
4. Click **Apply & Restart**
5. Wait for Kubernetes to start (check status bar)

Your kubeconfig is automatically configured at: `~/.kube/config`

### Minikube (Alternative)
See [MINIKUBE_SETUP.md](MINIKUBE_SETUP.md) for detailed instructions on setting up Minikube with:
- Docker Desktop Kubernetes integration
- Hyper-V (Windows Pro/Enterprise)
- VirtualBox

## Option 2: Cloud Kubernetes

### AWS EKS (Amazon Elastic Kubernetes Service)
```bash
# Create a cluster using AWS Console or AWS CLI
# https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html

# Get kubeconfig
aws eks update-kubeconfig --name <cluster-name> --region <region>
```

### Azure AKS (Azure Kubernetes Service)
```bash
# Create using Azure CLI
az aks get-credentials --resource-group <group> --name <cluster-name>
```

### Google GKE (Google Kubernetes Engine)
```bash
# Create using Google Cloud Console
# https://cloud.google.com/kubernetes-engine/docs/quickstart

# Get kubeconfig
gcloud container clusters get-credentials <cluster-name> --zone <zone>
```

## Deploying Your Application

### 1. Verify kubectl is working
```bash
kubectl cluster-info
kubectl get nodes
```

### 2. Deploy your application
```bash
# Create a namespace (optional)
kubectl create namespace fullstack

# Deploy all applications
kubectl apply -f k8s/ -n fullstack

# Or without namespace
kubectl apply -f k8s/
```

### 3. Verify deployment
```bash
# Check deployments
kubectl get deployments

# Check services
kubectl get services

# Check pods
kubectl get pods

# View logs
kubectl logs -l app=backend
kubectl logs -l app=frontend
```

### 4. Access your application
```bash
# Port-forward to access frontend
kubectl port-forward svc/frontend-service 8080:80

# Port-forward to access backend
kubectl port-forward svc/backend-service 8080:8080

# Open browser to http://localhost:8080
```

## GitHub Actions Setup (For CI/CD)

### 1. Get your kubeconfig
```bash
# Copy your kubeconfig content
cat ~/.kube/config

# Or for specific cluster
kubectl config view --flatten --minify
```

### 2. Add to GitHub Secrets
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click **New repository secret**
4. Name: `KUBE_CONFIG`
5. Value: Paste your kubeconfig content
6. Save

### 3. Add Docker credentials
1. Create Docker Hub account: https://hub.docker.com
2. Add secrets to GitHub:
   - `DOCKER_USERNAME`: Your Docker username
   - `DOCKER_PASSWORD`: Your Docker personal access token

### 4. Push code and GitHub Actions will:
- Build Docker images
- Push to Docker Hub
- Deploy to Kubernetes (if kubeconfig is set)

## Checking Deployment Status

```bash
# Get detailed pod information
kubectl describe pod <pod-name>

# Check service endpoints
kubectl get endpoints

# View resource usage
kubectl top nodes
kubectl top pods

# Stream logs
kubectl logs -f deployment/backend
kubectl logs -f deployment/frontend
```

## Troubleshooting

### Pods not starting
```bash
kubectl describe pod <pod-name>
```

### Can't connect to service
```bash
# Check service exists
kubectl get svc

# Check if pods are running
kubectl get pods

# Check endpoints
kubectl get endpoints
```

### Image pull errors
- Verify image name in deployment matches Docker Hub
- Check Docker credentials are configured in Kubernetes
- Create imagePullSecret if needed

## Next Steps

1. Set up a Kubernetes cluster (local or cloud)
2. Get your kubeconfig
3. Test deployments locally: `kubectl apply -f k8s/`
4. Add `KUBE_CONFIG` secret to GitHub
5. Push code and CI/CD will automatically deploy!

## Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Desktop Kubernetes](https://docs.docker.com/desktop/kubernetes/)
- [Minikube](https://minikube.sigs.k8s.io/)
- [AWS EKS](https://docs.aws.amazon.com/eks/)
- [Azure AKS](https://learn.microsoft.com/en-us/azure/aks/)
- [Google GKE](https://cloud.google.com/kubernetes-engine/docs)

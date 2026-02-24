# Minikube Setup Guide for Your Full Stack App

Minikube (v1.37.0) is already installed on your system. Follow one of these options to get it running.

## Option 1: Docker Desktop (Recommended, Easiest)

### Step 1: Install Docker Desktop
1. Download from: https://www.docker.com/products/docker-desktop
2. Install and restart your computer
3. Open Docker Desktop application

### Step 2: Enable Kubernetes in Docker Desktop
1. Click the Docker icon in system tray
2. Go to **Settings → Kubernetes**
3. Check **Enable Kubernetes**
4. Click **Apply & Restart**
5. Wait for Kubernetes to start (check status bar)

### Step 3: Test
```powershell
kubectl cluster-info
kubectl get nodes
```

---

## Option 2: Hyper-V (Windows Pro/Enterprise Required)

### Step 1: Enable Hyper-V
1. Open PowerShell **as Administrator**
2. Run:
```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```
3. Restart your computer

### Step 2: Create Virtual Switch (if needed)
```powershell
# Run PowerShell as Administrator
New-VMSwitch -Name "Minikube" -SwitchType Internal
```

### Step 3: Start Minikube
```powershell
# Run PowerShell as Administrator
minikube start --driver=hyperv --memory=4096 --cpus=2 --hyperv-virtual-switch="Minikube"
```

### Step 4: Test
```powershell
kubectl cluster-info
kubectl get nodes
```

---

## Option 3: VirtualBox

### Step 1: Install VirtualBox
1. Download from: https://www.virtualbox.org/wiki/Downloads
2. Install (choose default options)
3. Restart your computer

### Step 2: Start Minikube
```powershell
minikube start --driver=virtualbox --memory=4096 --cpus=2
```

### Step 3: Test
```powershell
kubectl cluster-info
kubectl get nodes
```

---

## After Starting Minikube

### 1. Verify Cluster is Running
```powershell
minikube status
kubectl cluster-info
kubectl get nodes
```

### 2. Deploy Your Application

#### Create Namespace (Optional)
```powershell
kubectl create namespace fullstack
```

#### Deploy Services and Deployments
```powershell
# From project root directory
kubectl apply -f k8s/

# Or with namespace
kubectl apply -f k8s/ -n fullstack
```

#### Verify Deployment
```powershell
# Check deployments
kubectl get deployments

# Check services
kubectl get services

# Check pods
kubectl get pods

# View pod details
kubectl describe pod <pod-name>
```

### 3. Access Your Application

#### Port Forward Method (Simplest)
```powershell
# In one terminal - backend
kubectl port-forward svc/backend-service 8080:8080

# In another terminal - frontend
kubectl port-forward svc/frontend-service 3000:80

# Open browser to:
# Frontend: http://localhost:3000
# Backend: http://localhost:8080/api/hello
```

#### Minikube Service Method
```powershell
# Open frontend in browser automatically
minikube service frontend-service

# Or backend
minikube service backend-service
```

#### LoadBalancer (if configured)
```powershell
# Get service IP
kubectl get svc

# In Minikube, use:
minikube ip
```

---

## Useful Commands

### Check Everything
```powershell
# All resources
kubectl get all

# With namespace
kubectl get all -n fullstack
```

### View Logs
```powershell
# Deployment logs
kubectl logs deployment/backend
kubectl logs deployment/frontend

# Specific pod logs
kubectl logs <pod-name>

# Stream logs
kubectl logs -f deployment/backend
```

### Update Deployments
```powershell
# Update image
kubectl set image deployment/backend backend=myregistry/demo-backend:v2.0

# Rollout history
kubectl rollout history deployment/backend

# Rollback
kubectl rollout undo deployment/backend
```

### Debug Pods
```powershell
# Shell into pod
kubectl exec -it <pod-name> -- /bin/sh

# Describe pod
kubectl describe pod <pod-name>

# Events
kubectl get events
```

### Dashboard
```powershell
# Open Minikube dashboard
minikube dashboard

# Or access web UI at: http://localhost:8001
kubectl proxy
```

---

## Update Docker Images in Deployment

If you want to use your own Docker images (built locally or from Docker Hub):

### 1. Update YAML Files
Edit `k8s/backend-deployment.yaml`:
```yaml
spec:
  containers:
  - name: backend
    image: yourusername/demo-backend:latest  # Change this
    imagePullPolicy: Always  # Add this to always pull
```

Edit `k8s/frontend-deployment.yaml`:
```yaml
spec:
  containers:
  - name: frontend
    image: yourusername/demo-frontend:latest  # Change this
    imagePullPolicy: Always  # Add this
```

### 2. Build and Push Images (if using Docker Hub)
```bash
# Build
docker build -t yourusername/demo-backend:latest backend
docker build -t yourusername/demo-frontend:latest frontend

# Push
docker push yourusername/demo-backend:latest
docker push yourusername/demo-frontend:latest
```

### 3. Deploy
```powershell
kubectl apply -f k8s/
```

---

## Stopping Minikube

```powershell
# Stop (can be restarted)
minikube stop

# Delete (removes everything)
minikube delete

# Restart
minikube start
```

---

## Troubleshooting

### Minikube won't start
```powershell
# Check status
minikube status

# View logs
minikube logs

# Delete and restart
minikube delete
minikube start --driver=<driver> --memory=4096 --cpus=2
```

### Pods not starting
```powershell
# Check pod status
kubectl describe pod <pod-name>

# Check events
kubectl get events --sort-by='.lastTimestamp'

# View logs
kubectl logs <pod-name>
```

### Can't access service
```powershell
# Check if service exists
kubectl get svc

# Check if pods are running
kubectl get pods

# Check endpoints
kubectl get endpoints

# Use port-forward
kubectl port-forward svc/frontend-service 3000:80
```

### Image pull errors
```powershell
# Check image name is correct
kubectl get deployment backend -o yaml | grep image

# For private registries, create secret:
kubectl create secret docker-registry myregistrykey \
  --docker-server=myregistry.com \
  --docker-username=myuser \
  --docker-password=mypass \
  --docker-email=myemail@example.com
```

---

## Next Steps

1. **Choose an option** (Docker Desktop recommended)
2. **Start Minikube** using the command for your option
3. **Run** `kubectl cluster-info` to verify it's working
4. **Deploy your app**: `kubectl apply -f k8s/`
5. **Access**: `kubectl port-forward svc/frontend-service 3000:80`
6. **Open browser**: http://localhost:3000

---

## Resources

- [Minikube Documentation](https://minikube.sigs.k8s.io/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Desktop Kubernetes](https://docs.docker.com/desktop/kubernetes/)
- [Hyper-V Documentation](https://docs.microsoft.com/en-us/virtualization/hyper-v-on-windows/)
- [VirtualBox Documentation](https://www.virtualbox.org/manual/)

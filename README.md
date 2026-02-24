# Angular + Spring Boot Full Stack Application

A modern full-stack web application with Angular 21 frontend and Spring Boot 3.4 backend, deployed to Kubernetes.

## Project Structure

```
├── frontend/                 # Angular 21 SSR application
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── angular.json
├── backend/                  # Spring Boot 3.4 REST API
│   ├── src/
│   ├── Dockerfile
│   ├── pom.xml
│   └── target/
├── k8s/                      # Kubernetes deployment files
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── service.yaml
├── .github/workflows/        # CI/CD pipeline (GitHub Actions)
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 20+ (for Angular)
- Java 17+ (for Spring Boot)
- Docker (for containerization)
- kubectl (for Kubernetes deployment) - optional

### Development

#### Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:4200
```

#### Backend
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080
```

## Architecture

### Frontend (Angular 21)
- **Framework**: Angular 21.1.3
- **Build**: Standalone components, SSR support
- **Features**: 
  - Real-time API integration
  - Client-side routing
  - Responsive design

### Backend (Spring Boot 3.4)
- **Framework**: Spring Boot 3.4.0
- **Java**: OpenJDK 17
- **REST API**: Endpoints for data operations
- **CORS**: Enabled for cross-origin requests

### Deployment

#### Docker
Each service has a multi-stage Dockerfile for optimized production builds:

```bash
# Build frontend image
docker build -t myregistry/demo-frontend:latest frontend

# Build backend image
docker build -t myregistry/demo-backend:latest backend
```

#### Kubernetes
See [KUBERNETES_SETUP.md](KUBERNETES_SETUP.md) for detailed setup instructions.

```bash
# Deploy to Kubernetes
kubectl apply -f k8s/

# Verify deployment
kubectl get deployments
kubectl get services
```

## CI/CD Pipeline

GitHub Actions automatically:
1. Builds Angular and Spring Boot applications
2. Creates Docker images
3. Pushes to Docker Hub
4. Deploys to Kubernetes (if configured)

### Setup GitHub Secrets

1. **Docker Hub Credentials**
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub access token

2. **Kubernetes (Optional)**
   - `KUBE_CONFIG`: Your kubeconfig file content

See [KUBERNETES_SETUP.md](KUBERNETES_SETUP.md) for detailed instructions.

## API Endpoints

### Backend
- `GET /api/hello` - Returns greeting message

### Frontend
- `http://localhost:4200/` - Main application

## Technology Stack

### Frontend
- Angular 21.1.3
- TypeScript 5.9
- RxJS 7.8
- Node 20

### Backend
- Spring Boot 3.4.0
- Java 17
- Maven
- OpenJDK

### DevOps
- Docker & Docker Compose
- Kubernetes
- GitHub Actions
- Nginx (frontend proxy)

## Development

### Code Quality
- ESLint for TypeScript
- Prettier for code formatting
- Spring Boot conventions

### Testing
```bash
# Frontend tests
npm test

# Backend tests
mvn test
```

### Building

```bash
# Frontend production build
npm run build

# Backend production build
mvn clean package
```

## Documentation

- [Kubernetes Setup Guide](KUBERNETES_SETUP.md)
- [Frontend README](frontend/README.md)
- [Angular Documentation](https://angular.io)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)

## Troubleshooting

### Frontend won't start
```bash
cd frontend
npm install
npm start
```

### Backend won't start
```bash
cd backend
mvn clean package
mvn spring-boot:run
```

### Kubernetes deployment issues
See [KUBERNETES_SETUP.md](KUBERNETES_SETUP.md) troubleshooting section

## License

MIT

## Support

For issues and questions, please check the documentation files.

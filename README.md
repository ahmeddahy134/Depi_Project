# Enterprise DevSecOps E-Commerce Platform

A Flask microservices e-commerce backend, containerized and orchestrated on Kubernetes (EKS),
provisioned with Terraform, secured by a shift-left CI/CD pipeline, and observed with
Prometheus/Grafana/CloudWatch — implementing the architecture in `docs/Engineering-Handbook.pdf`
and `docs/architecture-diagram.jpeg`.

This repo was reorganized from the original prototype into the handbook's canonical monorepo
layout, with services renamed to match the documented naming convention
(`product-service`, `cart-service`, `inventory-service`, `order-service`, `notification-service`),
plus two supporting services that existed in the prototype and are kept as extensions to the
handbook's core five: `admin-service` (back-office dashboard) and `api-gateway` (single
public entry point that proxies to each microservice).

## Repository layout

```
ecommerce-platform/
├── services/
│   ├── product-service/         # Catalog: products, categories, pricing        (port 5001)
│   ├── cart-service/            # Per-user shopping cart                       (port 5002)
│   ├── inventory-service/       # Stock levels, reservations                   (port 5003)
│   ├── order-service/           # Order orchestration (Product+Inventory+Notify)(port 5004)
│   ├── notification-service/    # Mocked order/email notifications             (port 5005)
│   ├── admin-service/           # Back-office dashboard (Jinja templates)       (port 5010)
│   └── api-gateway/             # Public reverse proxy in front of all services (port 8080)
├── frontend/                    # React + Vite storefront (GlowCare)            (port 3000)
├── infrastructure/terraform/
│   ├── modules/                 # vpc, eks, ecr, rds, redis, s3, cloudfront, route53, waf, iam
│   └── environments/{dev,prod}/ # Environment-specific root modules + remote state config
├── k8s/
│   ├── base/                    # Deployment/Service/ConfigMap/HPA per service + Ingress
│   └── overlays/{dev,prod}/     # Kustomize overlays
├── monitoring/
│   ├── prometheus/prometheus.yml
│   └── grafana-dashboards/
├── .github/workflows/
│   ├── ci.yml                   # lint → test → SonarQube → GitLeaks → OWASP DC → Trivy → ECR
│   ├── terraform-plan.yml       # runs on PRs touching infrastructure/**
│   ├── terraform-apply.yml      # runs on merge to main, manual approval gate
│   └── cd-deploy.yml            # kubectl rollout + smoke tests + auto-rollback
├── scripts/                     # init-multiple-dbs.sh, run_all.ps1 (local dev helper)
├── docs/
│   ├── Engineering-Handbook.pdf # full design document (source of truth for this structure)
│   └── architecture-diagram.jpeg
└── docker-compose.yml           # full local stack: Postgres, Redis, all services, gateway,
                                  # frontend, Prometheus, Grafana
```

## Business domain (per handbook Section 3)

| Service | Owns | Key tables | Calls out to |
|---|---|---|---|
| product-service | Catalog CRUD, pricing, categories | products, categories | — |
| cart-service | Per-user cart | carts, cart_items | product-service (validate price) |
| inventory-service | Stock levels & reservations | inventory, stock_movements | — (source of truth) |
| order-service | Order lifecycle | orders, order_items | product, inventory, notification |
| notification-service | Mocked order/email notifications | notifications_log | — |
| admin-service | Back-office CRUD for products/orders/coupons/users | shares product/order tables | product-service, order-service |
| api-gateway | Single public entrypoint, request routing | — (stateless) | all of the above |

Each Flask service exposes:
- `GET /health` → liveness/readiness probe target (Kubernetes + ALB target group + CI smoke test)
- `GET /metrics` → Prometheus-format metrics (via `prometheus-flask-exporter`)
- `GET/POST/... /api/v1/...` → REST business endpoints, versioned per the handbook's API standards

## Running locally

```bash
docker compose up --build
```

- Storefront: http://localhost:3000
- API Gateway: http://localhost:8080
- Admin dashboard: http://localhost:5010
- Grafana: http://localhost:3001 (admin / admin)
- Prometheus: http://localhost:9090

Each service can also be run standalone — see the `README.md` / `.env.example` inside
`services/<name>/`.

## Deploying to AWS

```bash
cd infrastructure/terraform/environments/dev
terraform init
terraform plan -out=tfplan
terraform apply tfplan

aws eks update-kubeconfig --name ecom-dev-eks --region us-east-1
kubectl apply -k ../../../../k8s/overlays/dev
```

See `docs/Engineering-Handbook.pdf` Section 14 for the full step-by-step deployment guide,
Section 15 for troubleshooting, and Section 6 for the Terraform module reference.

## CI/CD pipeline

Every pull request runs: lint (Flake8/Black/isort) → unit + integration tests → SonarQube SAST
→ GitLeaks secret scan → OWASP Dependency Check (SCA). Merges to `develop`/`main` additionally
build each service's Docker image, scan it with Trivy, push to Amazon ECR, and roll it out to
EKS with a post-deploy smoke test and automatic rollback on failure. See `.github/workflows/`.

## Notes on this reorganization

- Ports were standardized to the handbook's scheme (5001–5005 for the five core services);
  `api-gateway` (8080) and `admin-service` (5010) were kept outside that range to avoid collisions.
- `admin-service` was switched from MySQL/pymysql to PostgreSQL/psycopg2 so every service shares
  one database engine, matching the handbook's "shared PostgreSQL" trade-off (Section 1.4).
- `prometheus-flask-exporter` was added to all five core services so `/metrics` exists everywhere,
  per Section 9 of the handbook.
- Terraform modules are reference-quality scaffolding meant to be reviewed and filled in
  (security-group wiring between RDS/Redis/EKS, ALB DNS name after the Load Balancer Controller
  provisions it, etc.) before a real `terraform apply` against an AWS account.

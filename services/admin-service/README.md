# 🛡️ Admin Service — Techno Zone

## What's Included
- **Dashboard** with stats (users, products, orders, revenue)
- **Products** management (add, edit, delete, search)
- **Categories** management
- **Orders** management with status updates
- **Users** management
- **Coupons** management (add, toggle, delete)
- **Newsletter** subscribers list
- **Contact Messages** viewer

---

## Step-by-Step Deployment

### Step 1: Add is_admin to Database

```bash
mysql -h technozonemysql.czogakag0cly.eu-north-1.rds.amazonaws.com \
      -u admin -p techno_zone << 'EOF'
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
EOF
```

### Step 2: Create Admin User

```bash
mysql -h technozonemysql.czogakag0cly.eu-north-1.rds.amazonaws.com \
      -u admin -p techno_zone << 'EOF'
INSERT INTO users (name, email, password_hash, is_admin, created_at)
VALUES (
  'Ahmed Dahy Shaban',
  'admin@technozone.com',
  'pbkdf2:sha256:600000$placeholder',
  TRUE,
  NOW()
) ON DUPLICATE KEY UPDATE is_admin = TRUE;
EOF
```

> ⚠️ You'll set the real password hash in Step 3.

### Step 3: Build & Push to ECR

```bash
# Login to ECR
aws ecr get-login-password --region eu-north-1 | \
  docker login --username AWS --password-stdin \
  291761344539.dkr.ecr.eu-north-1.amazonaws.com

# Create ECR repo
aws ecr create-repository --repository-name technozone-admin --region eu-north-1

# Build & push
docker build -t technozone-admin .
docker tag technozone-admin:latest \
  291761344539.dkr.ecr.eu-north-1.amazonaws.com/technozone-admin:latest
docker push \
  291761344539.dkr.ecr.eu-north-1.amazonaws.com/technozone-admin:latest
```

### Step 4: Create ECS Task Definition

On AWS Console → ECS → Task Definitions → Create:
- **Family:** `technozone-admin`
- **CPU:** 0.5 vCPU / **Memory:** 1 GB
- **Container name:** `technozone-admin`
- **Image:** `291761344539.dkr.ecr.eu-north-1.amazonaws.com/technozone-admin:latest`
- **Port:** `5004`
- **Environment variables:**
  - `CONNECTION_STRING` = `mysql+pymysql://admin:Ad#123456@technozonemysql.czogakag0cly.eu-north-1.rds.amazonaws.com:3306/techno_zone`
  - `SECRET_KEY` = `technozone-super-secret-2026`

### Step 5: Create Target Group

On EC2 → Target Groups → Create:
- **Name:** `technozone-admin-tg`
- **Type:** IP addresses
- **Port:** `5004`
- **Health check:** `/health`

### Step 6: Add ALB Rule

On EC2 → Load Balancers → technozone-alb → Listeners → Add rule:
- **Path:** `/admin/*`
- **Target:** `technozone-admin-tg`
- **Priority:** `6`

### Step 7: Create ECS Service

On ECS → acclaimed-bat-sy18gl → Create service:
- **Task definition:** `technozone-admin`
- **Service name:** `technozone-admin-svc`
- **Desired tasks:** `1`
- **Security group:** Add port 5004 from ALB
- **Load balancer:** `technozone-alb` / listener HTTP:80 / target: `technozone-admin-tg`

### Step 8: Add Security Group Rule

On EC2 → Security Groups → technozone-ecs-sg → Edit inbound:
- Add: Custom TCP | Port `5004` | Source: `technozone-alb-sg`

### Step 9: Create Admin Account

```bash
# Run once inside the container or locally with correct env vars
python create_admin.py
```

Or directly via MySQL with hashed password:
```bash
python3 -c "
from werkzeug.security import generate_password_hash
print(generate_password_hash('Admin@123456'))
"
# Copy the hash, then:
mysql -h technozonemysql.czogakag0cly.eu-north-1.rds.amazonaws.com -u admin -p techno_zone
# UPDATE users SET password_hash='<paste hash>' WHERE email='admin@technozone.com';
```

---

## Access

```
http://technozone-alb-1748964274.eu-north-1.elb.amazonaws.com/admin/login
Email: admin@technozone.com
Password: Admin@123456
```

---

## Architecture

```
Internet
   ↓
ALB (technozone-alb)
   ↓ /admin/*
Admin Service (port 5004)
   ↓
RDS MySQL (shared database)
```

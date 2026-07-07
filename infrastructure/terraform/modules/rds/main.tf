variable "project" { type = string }
variable "environment" { type = string }
variable "subnet_ids" { type = list(string) }
variable "vpc_id" { type = string }
variable "allowed_security_group_ids" { type = list(string) }
variable "instance_class" {
  type    = string
  default = "db.t3.medium"
}
variable "allocated_storage" {
  type    = number
  default = 20
}
variable "multi_az" {
  type    = bool
  default = false
}
variable "db_name" {
  type    = string
  default = "ecommerce"
}
variable "master_username" {
  type    = string
  default = "ecom_admin"
}

resource "aws_db_subnet_group" "this" {
  name       = "${var.project}-${var.environment}-db-subnets"
  subnet_ids = var.subnet_ids
}

resource "aws_security_group" "rds" {
  name_prefix = "${var.project}-${var.environment}-rds-"
  vpc_id      = var.vpc_id

  ingress {
    description     = "PostgreSQL from EKS nodes only"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = var.allowed_security_group_ids
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "random_password" "master" {
  length  = 20
  special = true
}

resource "aws_secretsmanager_secret" "db_credentials" {
  name = "${var.project}/${var.environment}/db-credentials"
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = var.master_username
    password = random_password.master.result
    dbname   = var.db_name
  })
}

resource "aws_db_instance" "this" {
  identifier              = "${var.project}-${var.environment}-postgres"
  engine                  = "postgres"
  engine_version          = "16"
  instance_class          = var.instance_class
  allocated_storage       = var.allocated_storage
  storage_encrypted       = true
  db_name                 = var.db_name
  username                = var.master_username
  password                = random_password.master.result
  db_subnet_group_name    = aws_db_subnet_group.this.name
  vpc_security_group_ids  = [aws_security_group.rds.id]
  multi_az                = var.multi_az
  backup_retention_period = 7
  skip_final_snapshot     = var.environment != "prod"
  deletion_protection     = var.environment == "prod"

  tags = { Project = var.project, Environment = var.environment }
}

output "endpoint" { value = aws_db_instance.this.endpoint }
output "security_group_id" { value = aws_security_group.rds.id }
output "secret_arn" { value = aws_secretsmanager_secret.db_credentials.arn }

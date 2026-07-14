variable "project" { type = string }
variable "environment" { type = string }
variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}
variable "azs" { type = list(string) }
variable "public_subnet_cidrs" { type = list(string) }
variable "private_subnet_cidrs" { type = list(string) }
variable "data_subnet_cidrs" { type = list(string) }

# A NAT Gateway costs ~$0.045/hr (~$32/mo) PLUS per-GB data processing charges,
# even when idle — it is one of the biggest line items in a small dev account.
# Set to false (the dev default) to skip it entirely: the private route table
# then has no outbound internet route, so nothing that needs egress can live
# in the private subnets. In that mode, put the EKS node group in the PUBLIC
# subnets instead (see environments/dev/main.tf) — they already route
# 0.0.0.0/0 via the Internet Gateway at no extra cost. Production keeps this
# true so workloads can stay fully private.
variable "enable_nat_gateway" {
  type    = bool
  default = true
}

resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name        = "${var.project}-${var.environment}-vpc"
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
  tags   = { Name = "${var.project}-${var.environment}-igw" }
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.this.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = var.azs[count.index]
  map_public_ip_on_launch = true
  tags = {
    Name                                        = "${var.project}-${var.environment}-public-${count.index}"
    "kubernetes.io/role/elb"                     = "1"
    "kubernetes.io/cluster/${var.project}-${var.environment}-eks" = "shared"
  }
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = var.azs[count.index]
  tags = {
    Name                                        = "${var.project}-${var.environment}-private-${count.index}"
    "kubernetes.io/role/internal-elb"            = "1"
    "kubernetes.io/cluster/${var.project}-${var.environment}-eks" = "shared"
  }
}

resource "aws_subnet" "data" {
  count             = length(var.data_subnet_cidrs)
  vpc_id            = aws_vpc.this.id
  cidr_block        = var.data_subnet_cidrs[count.index]
  availability_zone = var.azs[count.index]
  tags = { Name = "${var.project}-${var.environment}-data-${count.index}" }
}

resource "aws_eip" "nat" {
  count  = var.enable_nat_gateway ? 1 : 0
  domain = "vpc"
}

resource "aws_nat_gateway" "this" {
  count         = var.enable_nat_gateway ? 1 : 0
  allocation_id = aws_eip.nat[0].id
  subnet_id     = aws_subnet.public[0].id
  tags          = { Name = "${var.project}-${var.environment}-nat" }
  depends_on    = [aws_internet_gateway.this]
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }
  tags = { Name = "${var.project}-${var.environment}-public-rt" }
}

# When enable_nat_gateway = false, this route table is created with no
# 0.0.0.0/0 route — private/data subnets stay valid but have no internet
# egress. Nothing in the dev environment is scheduled there (see the eks
# module's subnet_ids in environments/dev/main.tf).
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.this.id
  tags   = { Name = "${var.project}-${var.environment}-private-rt" }
}

resource "aws_route" "private_nat" {
  count                  = var.enable_nat_gateway ? 1 : 0
  route_table_id         = aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.this[0].id
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

output "vpc_id" { value = aws_vpc.this.id }
output "public_subnet_ids" { value = aws_subnet.public[*].id }
output "private_subnet_ids" { value = aws_subnet.private[*].id }
output "data_subnet_ids" { value = aws_subnet.data[*].id }

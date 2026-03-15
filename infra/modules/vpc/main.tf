resource "aws_vpc" "test1" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = var.enable_dns_hostnames
  enable_dns_support   = var.enable_dns_support

  tags = merge(
    {
      Name = var.name
    },
    var.tags
  )
}

resource "aws_internet_gateway" "test1" {
  vpc_id = aws_vpc.test1.id

  tags = merge(
    {
      Name = "${var.name}-igw"
    },
    var.tags
  )
}

resource "aws_subnet" "public" {
  count = length(var.public_subnets)

  vpc_id                  = aws_vpc.test1.id
  cidr_block              = var.public_subnets[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = merge(
    {
      Name = "${var.name}-public-${count.index + 1}"
    },
    var.tags
  )
}

resource "aws_subnet" "private" {
  count = length(var.private_subnets)

  vpc_id            = aws_vpc.test1.id
  cidr_block        = var.private_subnets[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = merge(
    {
      Name = "${var.name}-private-${count.index + 1}"
    },
    var.tags
  )
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.test1.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.test1.id
  }

  tags = merge(
    {
      Name = "${var.name}-public"
    },
    var.tags
  )
}

resource "aws_route_table_association" "public" {
  count = length(var.public_subnets)

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  count = length(var.private_subnets)

  vpc_id = aws_vpc.test1.id

  tags = merge(
    {
      Name = "${var.name}-private-${count.index + 1}"
    },
    var.tags
  )
}

resource "aws_route_table_association" "private" {
  count = length(var.private_subnets)

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

# Optionally create NAT gateway in the first public subnet
resource "aws_eip" "nat" {
  count = var.create_nat_gateway ? 1 : 0
}

resource "aws_nat_gateway" "this" {
  count         = var.create_nat_gateway ? 1 : 0
  allocation_id = aws_eip.nat[0].id
  subnet_id     = aws_subnet.public[0].id
  tags = merge({
    Name = "${var.name}-nat"
  }, var.tags)
}

# Terraform state backend resources
resource "aws_s3_bucket" "tfstate" {
  bucket = var.environment != "" ? "${var.name}-${var.environment}-tfstate" : "${var.name}-tfstate"

  tags = merge({
    Name = var.environment != "" ? "${var.name}-${var.environment}-tfstate" : "${var.name}-tfstate"
  }, var.tags)
}

resource "aws_s3_bucket_versioning" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.test1.id
}

output "vpc_arn" {
  description = "The ARN of the VPC"
  value       = aws_vpc.test1.arn
}

output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = aws_vpc.test1.cidr_block
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = aws_subnet.private[*].id
}

output "public_route_table_ids" {
  description = "List of IDs of public route tables"
  value       = [aws_route_table.public.id]
}

output "private_route_table_ids" {
  description = "List of IDs of private route tables"
  value       = aws_route_table.private[*].id
}

output "internet_gateway_id" {
  description = "The ID of the Internet Gateway"
  value       = aws_internet_gateway.test1.id
}
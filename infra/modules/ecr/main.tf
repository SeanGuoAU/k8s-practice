resource "aws_ecr_repository" "test1" {
  name                 = var.name
  image_tag_mutability = var.image_tag_mutability

  image_scanning_configuration {
    scan_on_push = var.scan_on_push
  }

  encryption_configuration {
    encryption_type = var.encryption ? "AES256" : "NONE"
  }

  tags = var.tags
}

resource "aws_ecr_lifecycle_policy" "test1" {
  count      = var.lifecycle_policy != "" ? 1 : 0
  repository = aws_ecr_repository.test1.name

  policy = var.lifecycle_policy
}
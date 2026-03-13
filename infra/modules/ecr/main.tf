resource "aws_ecr_repository" "test1" {
  name                 = var.name
  image_tag_mutability = var.image_tag_mutability

  image_scanning_configuration {
    scan_on_push = var.scan_on_push
  }

  encryption_configuration {
    encryption_type = var.encryption ? "AES256" : "NONE"
  }

  dynamic "lifecycle_policy" {
    for_each = var.lifecycle_policy != "" ? [1] : []
    content {
      policy = var.lifecycle_policy
    }
  }

  tags = var.tags
}
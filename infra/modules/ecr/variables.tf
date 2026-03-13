variable "name" {
  description = "Name of the ECR repository"
  type        = string
  default     = "k8s"
}

variable "image_tag_mutability" {
  description = "The tag mutability setting for the repository"
  type        = string
  default     = "MUTABLE"
}

variable "scan_on_push" {
  description = "Indicates whether images are scanned after being pushed to the repository"
  type        = bool
  default     = true
}

variable "encryption" {
  description = "Enable encryption for the repository (e.g., AES256 or KMS)"
  type        = bool
  default     = true
}

variable "lifecycle_policy" {
  description = "Optional lifecycle policy JSON for the repository"
  type        = string
  default     = ""
}

variable "tags" {
  description = "A map of tags to assign to the resource"
  type        = map(string)
  default     = {}
}
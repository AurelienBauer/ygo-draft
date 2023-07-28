variable "namespace" {
  type    = string
  default = "terraform-ygo"
}

variable "vpc_cidr_block" {
  type    = string
  default = "10.10.0.0/16"
}
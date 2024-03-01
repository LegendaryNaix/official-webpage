variable "vercel_origin_dns" {
  type = string
}

variable "region" {
  type = string
}

variable "availability_zones" {
  type    = list(string)
  default = ["ap-northeast-2a", "ap-northeast-2b"]
}

variable "jwt_secret" {
  type      = string
  sensitive = true
}

variable "postgres_password" {
  type      = string
  sensitive = true
}

variable "postgres_username" {
  type = string
}

variable "postgres_port" {
  type    = number
  default = 5432
}

variable "redis_port" {
  type    = number
  default = 6379
}

variable "cdn_base_url" {
  type    = string
  default = "cdn.skku-royals.com"
}

variable "aws_cdn_bucket_name" {
  type    = string
  default = "skku-royals-cdn-bucket"
}

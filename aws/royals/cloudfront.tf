resource "aws_cloudfront_origin_access_control" "main" {
  name                              = "skku-royals-s3-oai"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

data "aws_cloudfront_cache_policy" "disable" {
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_origin_request_policy" "allow_all" {
  name = "Managed-AllViewer"
}

resource "aws_cloudfront_distribution" "main" {
  origin {
    domain_name = var.vercel_origin_dns
    origin_id   = "vercel"

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "https-only"
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_keepalive_timeout = 5
      origin_read_timeout      = 30
    }
  }

  enabled = true
  comment = "SKKU ROYALS CloudFront"

  aliases = ["skku-royals.com"]

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    target_origin_id       = "vercel"
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.main.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

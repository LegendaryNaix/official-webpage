######### AWS Cloudfront Distribution ##########
resource "aws_cloudfront_distribution" "main" {
  origin {
    domain_name              = aws_s3_bucket.cdn_bucket.bucket_regional_domain_name
    origin_id                = aws_s3_bucket.cdn_bucket.id
    origin_access_control_id = aws_cloudfront_origin_access_control.main.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.cdn_bucket.id
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  price_class = "PriceClass_200"
  enabled     = true
  comment     = "skku-royals-cdn-cloudfront-distribution"
  aliases     = ["cdn.skku-royals.com"]


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

########## AWS CloudFront OAC ##########
resource "aws_cloudfront_origin_access_control" "main" {
  name                              = "skku-royals-cdn-s3-oai"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

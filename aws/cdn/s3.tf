resource "aws_s3_bucket" "cdn_bucket" {
  bucket = "skku-royals-cdn-bucket"

  tags = {
    Name = "cdn.skku-royals.com"
  }
}

data "aws_iam_policy_document" "cdn" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.cdn_bucket.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.main.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "cdn" {
  bucket = aws_s3_bucket.cdn_bucket.id
  policy = data.aws_iam_policy_document.cdn.json
}

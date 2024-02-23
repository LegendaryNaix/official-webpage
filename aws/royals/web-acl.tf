data "aws_wafv2_web_acl" "main" {
  name     = "CreatedByCloudFront-f2db1d79-1668-4cd1-ab35-2971f090c21f"
  scope    = "CLOUDFRONT"
  provider = aws.east
}

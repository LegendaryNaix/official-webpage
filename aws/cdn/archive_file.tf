data "archive_file" "cdn" {
  type        = "zip"
  source_file = "${path.module}/lambda_function/index.js"
  output_path = "${path.module}/lambda_function.zip"
}

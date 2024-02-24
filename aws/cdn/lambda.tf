########## AWS Lambda ##########
resource "aws_lambda_function" "cdn" {
  function_name = "hostFilterLambdaFunction"
  handler       = "index.handler"
  role          = aws_iam_role.lambda_execution_role.arn
  runtime       = "nodejs20.x"
  provider      = aws.us-east-1

  filename         = data.archive_file.cdn.output_path
  source_code_hash = data.archive_file.cdn.output_base64sha256

  publish = true
}

resource "aws_lambda_permission" "cdn" {
  statement_id  = "AllowExecutionFromCloudFront"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cdn.arn
  principal     = "cloudfront.amazonaws.com"
  provider      = aws.us-east-1
}

resource "aws_iam_role" "lambda_execution_role" {
  name = "lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Effect = "Allow"
        Sid    = ""
      },
      {
        Action = "sts:AssumeRole"
        Principal = {
          Service = "edgelambda.amazonaws.com"
        }
        Effect = "Allow"
        Sid    = ""
      }
    ]
  })
}

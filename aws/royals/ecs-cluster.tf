########## ECS Cluster ##########
resource "aws_ecs_cluster" "main" {
  name = "skku_royals_api"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

################# ECS Task Execution Role #################
resource "aws_iam_instance_profile" "ecs_task_execution_role" {
  name = "skku_royals_ecs_task_execution_profile"
  role = aws_iam_role.ecs_task_execution_role.name
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "skku_royals_ecs_task_execution_role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_role.json
}

data "aws_iam_policy_document" "ecs_task_execution_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

########## ECS TaskRole ##########
resource "aws_iam_instance_profile" "ecs_task_role" {
  name = "skku_royals_ecs_task_profile"
  role = aws_iam_role.ecs_task_role.name
}

resource "aws_iam_role" "ecs_task_role" {
  name = "skku_royals_ecs_task_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "s3_full_access_role" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

resource "aws_iam_policy" "ses_access_policy" {
  name        = "skku_royals_ses_access_policy"
  description = "Policy for ECS Tasks to access SES"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "ses:SendEmail",
          "ses:SendRawEmail"
        ],
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ses_access_role" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ses_access_policy.arn
}

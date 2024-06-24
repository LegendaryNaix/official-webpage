########## Application Load Balancer ##########
resource "aws_lb" "api" {
  name               = "skku-royals-elb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.elb.id]
  subnets            = [aws_subnet.public_1.id, aws_subnet.public_2.id]
  enable_http2       = true
}

resource "aws_lb_listener" "api" {
  load_balancer_arn = aws_lb.api.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api.arn
  }
}

resource "aws_lb_target_group" "api" {
  name        = "skku-royals-elb-tg"
  target_type = "ip"
  port        = 4000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id

  health_check {
    interval            = 30
    path                = "/api/test"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    matcher             = "200-404"
  }

  lifecycle {
    create_before_destroy = true
  }
}

########## ECS Service ##########
resource "aws_ecs_service" "main" {
  name                              = "skku-royals-ecs-service"
  cluster                           = aws_ecs_cluster.main.id
  task_definition                   = aws_ecs_task_definition.api.family
  desired_count                     = 2
  launch_type                       = "FARGATE"
  health_check_grace_period_seconds = 300
  force_new_deployment              = true

  network_configuration {
    assign_public_ip = true
    security_groups  = [aws_security_group.ecs.id]
    subnets          = [aws_subnet.public_1.id, aws_subnet.public_2.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api.arn
    container_name   = "skku-royals-api"
    container_port   = 4000
  }

  depends_on = [
    aws_lb_listener.api
  ]
}

###################### ECS Task Definition ######################
resource "aws_ecs_task_definition" "api" {
  family                   = "skku-royals-api"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512

  container_definitions = templatefile("${path.module}/task-definition.tftpl", {
    task_name           = "skku-royals-api",
    database_url        = "postgresql://${var.postgres_username}:${var.postgres_password}@${aws_instance.database.private_ip}:${var.postgres_port}/royals?schema=public",
    ecr_uri             = aws_ecr_repository.main.repository_url,
    container_port      = 4000,
    cloudwatch_region   = var.region,
    redis_host          = aws_instance.cache.private_ip,
    redis_port          = var.redis_port,
    jwt_secret          = var.jwt_secret,
    cdn_base_url        = var.cdn_base_url,
    aws_cdn_bucket_name = var.aws_cdn_bucket_name,
    nodemailer_from     = "SKKU ROYALS <no-reply@skku-royals.com>"
  })

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn      = aws_iam_role.ecs_task_role.arn
}

########## ECS Service Scaling ##########
resource "aws_appautoscaling_target" "api" {
  max_capacity       = 2
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.main.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_policy_up" {
  name               = "ecs-auto-scaling-policy-up"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  service_namespace  = aws_appautoscaling_target.api.service_namespace

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Average"

    step_adjustment {
      metric_interval_lower_bound = 0
      scaling_adjustment          = 1
    }
  }
}

resource "aws_cloudwatch_metric_alarm" "ecs_cpu_utilization_high" {
  alarm_name          = "ecs-cpu-utilization-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = "80"

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.main.name
  }

  alarm_actions = [aws_appautoscaling_policy.ecs_policy_up.arn]
}

resource "aws_appautoscaling_policy" "ecs_policy_down" {
  name               = "ecs-auto-scaling-policy-down"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.api.resource_id
  scalable_dimension = aws_appautoscaling_target.api.scalable_dimension
  service_namespace  = aws_appautoscaling_target.api.service_namespace

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Average"

    step_adjustment {
      metric_interval_upper_bound = 0
      scaling_adjustment          = -1
    }
  }
}

resource "aws_cloudwatch_metric_alarm" "ecs_cpu_utilization_low" {
  alarm_name          = "ecs-cpu-utilization-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = "30"

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.main.name
  }

  alarm_actions = [aws_appautoscaling_policy.ecs_policy_down.arn]
}

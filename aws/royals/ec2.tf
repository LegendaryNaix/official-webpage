resource "aws_instance" "database" {
  ami                    = "ami-0c28dbbd4ed200038"
  instance_type          = "t4g.small"
  subnet_id              = aws_subnet.private_1.id
  vpc_security_group_ids = [aws_security_group.ec2.id]

  user_data = templatefile("${path.module}/postgres-docker.sh.tpl", { postgres_password = var.postgres_password })

  tags = {
    Name = "PostgrSQL EC2 Instance"
  }
}

resource "aws_instance" "cache" {
  ami                    = "ami-0c28dbbd4ed200038"
  instance_type          = "t4g.micro"
  subnet_id              = aws_subnet.private_2.id
  vpc_security_group_ids = [aws_security_group.ec2.id]

  user_data = templatefile("${path.module}/redis-docker.sh.tpl", {})

  tags = {
    Name = "Redis EC2 Instance"
  }
}

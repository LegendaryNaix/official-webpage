#!/bin/bash
sudo yum update -y
sudo yum install docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user
docker run --name redis -d -p 6379:6379 redis:7

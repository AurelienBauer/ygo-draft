locals {
  vpc = {
    azs        = slice(data.aws_availability_zones.available.names, 0, 1)
    cidr_block = var.vpc_cidr_block
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

# VPC
resource "aws_vpc" "default" {
  cidr_block           = local.vpc.cidr_block
  enable_dns_hostnames = false
  enable_dns_support   = true

  tags = {
    Name = "${var.namespace}-vpc"
  }
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.default.id
  cidr_block              = cidrsubnet(aws_vpc.default.cidr_block, 8, 0)
  availability_zone       = local.vpc.azs[0]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.namespace}-subnet-public"
  }
}

resource "aws_subnet" "private" {
  vpc_id                  = aws_vpc.default.id
  cidr_block              = cidrsubnet(aws_vpc.default.cidr_block, 8, 1)
  availability_zone       = local.vpc.azs[0]

  tags = {
    Name = "${var.namespace}-subnet-private"
  }
}

resource "aws_internet_gateway" "default" {
  vpc_id = aws_vpc.default.id

  tags = {
    Name = "${var.namespace}-internet-gateway"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.default.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.default.id
  }

  tags = {
    Name = "${var.namespace}-route-table-public"
  }
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.default.id

  tags = {
    Name = "${var.namespace}-route-table-private"
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "private" {
  subnet_id      = aws_subnet.private.id
  route_table_id = aws_route_table.private.id
}

resource "aws_security_group" "bastion" {
  name_prefix = "${var.namespace}-bastion-sg"
  vpc_id      = aws_vpc.default.id

  lifecycle {
    create_before_destroy = false
  }
}

resource "aws_vpc_security_group_ingress_rule" "bastion-http" {
  security_group_id = aws_security_group.bastion.id
  description = "Allow HTTP from any IP"

  cidr_ipv4 = "0.0.0.0/0"
  from_port      = 80
  to_port        = 80
  ip_protocol    = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "bastion-ssh" {
  security_group_id = aws_security_group.bastion.id
  description = "Allow SSH from any IP"

  cidr_ipv4 = "0.0.0.0/0"
  from_port      = 22
  to_port        = 22
  ip_protocol    = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "bastion" {
  security_group_id = aws_security_group.bastion.id
  description      = "Allow all outbound traffic"

  cidr_ipv4 = "0.0.0.0/0"
  from_port        = -1
  to_port          = -1
  ip_protocol      = "-1"
}

resource "aws_security_group" "app" {
  name_prefix = "${var.namespace}-app-sg"
  vpc_id      = aws_vpc.default.id

  lifecycle {
    create_before_destroy = false
  }
}

resource "aws_vpc_security_group_ingress_rule" "app-http" {
  security_group_id = aws_security_group.app.id
  description = "Allow HTTP from security groups bastion host"

  referenced_security_group_id = aws_security_group.bastion.id
  from_port      = 80
  to_port        = 80
  ip_protocol    = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "app-ssh" {
  security_group_id = aws_security_group.app.id
  description = "Allow SSH from security groups bastion host"

  referenced_security_group_id = aws_security_group.bastion.id
  from_port      = 22
  to_port        = 22
  ip_protocol    = "tcp"
}

resource "aws_vpc_security_group_egress_rule" "app" {
  security_group_id = aws_security_group.app.id
  description      = "Allow all outbound traffic"

  cidr_ipv4 = "0.0.0.0/0"
  from_port        = -1
  to_port          = -1
  ip_protocol      = "-1"
}

resource "aws_security_group" "nat" {
  name_prefix = "${var.namespace}-nat-sg"
  vpc_id      = aws_vpc.default.id

  lifecycle {
    create_before_destroy = false
  }
}

resource "aws_vpc_security_group_ingress_rule" "nat-http" {
  security_group_id = aws_security_group.nat.id
  description = "Allow HTTP from virtual network"

  cidr_ipv4 = aws_vpc.default.cidr_block
  from_port      = 80
  to_port        = 80
  ip_protocol    = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "nat-https" {
  security_group_id = aws_security_group.nat.id
  description = "Allow HTTPS from virtual network"

  cidr_ipv4 = aws_vpc.default.cidr_block
  from_port      = 443
  to_port        = 443
  ip_protocol    = "tcp"
}

resource "aws_vpc_security_group_ingress_rule" "nat-ping" {
  security_group_id = aws_security_group.nat.id
  description = "Allow PING from virtual network"

  cidr_ipv4 = aws_vpc.default.cidr_block
  from_port      = -1
  to_port        = -1
  ip_protocol    = "icmp"
}

resource "aws_vpc_security_group_egress_rule" "nat" {
  security_group_id = aws_security_group.nat.id
  description      = "Allow all outbound traffic"

  cidr_ipv4 = "0.0.0.0/0"
  from_port        = -1
  to_port          = -1
  ip_protocol      = "-1"
}

data "aws_ami" "linux" {
  owners      = ["amazon"]
  most_recent = true

  filter {
    name   = "name"
    values = ["al2023-ami-2023*"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

resource "tls_private_key" "bastion-host" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "tls_private_key" "app-front" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "tls_private_key" "app-back" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "bastion-host" {
  key_name   = "${var.namespace}-bastion-host-key-pair"
  public_key = "${tls_private_key.bastion-host.public_key_openssh}"
}

resource "aws_key_pair" "app-front" {
  key_name   = "${var.namespace}-app-front-key-pair"
  public_key = "${tls_private_key.app-front.public_key_openssh}"
}

resource "aws_key_pair" "app-back" {
  key_name   = "${var.namespace}-app-back-key-pair"
  public_key = "${tls_private_key.app-back.public_key_openssh}"
}

resource "aws_instance" "frontapp" {
  ami = data.aws_ami.linux.id
  instance_type = "t2.nano"
  subnet_id = aws_subnet.private.id

  availability_zone = local.vpc.azs[0]
  vpc_security_group_ids = [aws_security_group.app.id]
  key_name = aws_key_pair.app-front.key_name
  user_data = file("${path.module}/scripts/user_data_app_front.sh")

  tags = {
    Name = "${var.namespace}-front"
  }

  root_block_device {
    delete_on_termination = true
  }
}

resource "aws_instance" "backapp" {
  ami = data.aws_ami.linux.id
  instance_type = "t2.nano"
  subnet_id = aws_subnet.private.id

  availability_zone = local.vpc.azs[0]
  vpc_security_group_ids = [aws_security_group.app.id]
  key_name = aws_key_pair.app-back.key_name
  user_data = file("${path.module}/scripts/user_data_app_back.sh")

  tags = {
    Name = "${var.namespace}-back"
  }

  root_block_device {
    delete_on_termination = true
  }
}

resource "aws_instance" "bastion-host" {
  ami = data.aws_ami.linux.id
  instance_type = "t2.nano"
  subnet_id = aws_subnet.public.id

  availability_zone = local.vpc.azs[0]
  vpc_security_group_ids = [aws_security_group.bastion.id]
  key_name = aws_key_pair.bastion-host.key_name

  tags = {
    Name = "${var.namespace}-bastion-host"
  }

  root_block_device {
    delete_on_termination = true
  }

  user_data = templatefile("${path.module}/scripts/user_data_bastion_host.sh", {
    app-front-ipv4 = aws_instance.frontapp.private_ip
    app-back-ipv4 = aws_instance.backapp.private_ip
  })

  provisioner "file" {
    content      = tls_private_key.app-front.private_key_pem
    destination = "/home/ec2-user/app-front-prv-key.pem"
  }

  provisioner "file" {
    content      = tls_private_key.app-back.private_key_pem
    destination = "/home/ec2-user/app-back-prv-key.pem"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod 0400 /home/ec2-user/app-front-prv-key.pem",
      "chmod 0400 /home/ec2-user/app-back-prv-key.pem",
    ]
  }

  connection {
    type     = "ssh"
    user     = "ec2-user"
    private_key = tls_private_key.bastion-host.private_key_pem
    host     = self.public_ip
  }
}

data "aws_ami" "linux-nat" {
  owners      = ["137112412989"]
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn-ami-vpc-nat-2018*"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

resource "aws_instance" "nat" {
  ami = data.aws_ami.linux-nat.id
  instance_type = "t2.nano"
  subnet_id = aws_subnet.public.id

  availability_zone = local.vpc.azs[0]
  vpc_security_group_ids = [aws_security_group.nat.id]

  source_dest_check = false

  tags = {
    Name = "${var.namespace}-nat"
  }

  root_block_device {
    delete_on_termination = true
  }
}

resource "aws_route" "nat-instance" {
  route_table_id = aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  network_interface_id = aws_instance.nat.primary_network_interface_id  
}

output "public-ipv4" {
  value = aws_instance.bastion-host.public_ip
}
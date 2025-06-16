#!/bin/bash
set -e

echo "Updating system packages..."
sudo apt update
sudo apt upgrade -y

echo "Installing dependencies..."
sudo apt install -y ca-certificates curl gnupg lsb-release software-properties-common

echo "Adding Docker GPG key and repo..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "Updating package index..."
sudo apt update

echo "Installing Docker Engine and Docker Compose plugin..."
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "Adding current user to docker group to run docker without sudo..."
sudo usermod -aG docker $USER

echo "Installation completed! Please log out and back in (or reboot) to apply user group changes."

echo "Verify Docker installation:"
docker version

echo "Verify Docker Compose installation:"
docker compose version

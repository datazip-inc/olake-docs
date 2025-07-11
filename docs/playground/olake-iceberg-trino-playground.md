# OLake + Iceberg + Trino Playground

This document provides instructions for setting up a local Trino playground with the TPCH connector, demonstrating basic Trino functionality through its web UI and CLI. This setup uses Docker and Docker Compose for easy deployment.

## Prerequisites

Before you begin, ensure you have the following installed on your macOS system:

* **Docker Desktop:** Install from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop). Ensure Docker is running.
* **Homebrew:** A package manager for macOS. If not installed, follow instructions on [https://brew.sh](https://brew.sh).
* **OpenJDK 17:** Required to run the Trino CLI.
* **Trino CLI:** The command-line interface for Trino.

## Setup Steps

### 1. Install Java (OpenJDK 17) and Trino CLI

Let's get your Java environment ready for Trino.

```bash
# Install OpenJDK 17 via Homebrew
brew install openjdk@17

# Set up Java symlink for system recognition
sudo ln -sfn /usr/local/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk

# Add OpenJDK 17 to your shell's PATH for command-line access
echo 'export PATH="/usr/local/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Confirm Java is installed correctly
java -version

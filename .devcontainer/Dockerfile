FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:20-bullseye

# Install dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends netcat

# Install AWS CLI
RUN architecture=$(dpkg --print-architecture) && if [ "$architecture" = "arm64" ]; then \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscli.zip"; \
    else \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscli.zip"; \
    fi \
    && unzip awscli.zip \
    && ./aws/install \
    && rm -rf aws awscli.zip

# Set NODE_ENV as Dev
ENV NODE_ENV=development
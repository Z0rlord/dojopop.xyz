#!/bin/bash
# Deploy to Cloudflare Pages using Doppler secrets

# Load secrets from Doppler
echo "Loading secrets from Doppler..."
export $(doppler secrets download --format env --no-file | xargs)

# Check if CLOUDFLARE_API_TOKEN is set
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "Error: CLOUDFLARE_API_TOKEN not found in Doppler"
  exit 1
fi

echo "Deploying to Cloudflare Pages..."

# Install Wrangler if not present
if ! command -v wrangler &> /dev/null; then
  echo "Installing Wrangler..."
  npm install -g wrangler
fi

# Deploy
wrangler pages deploy .next --project-name=dojopop --branch=master

echo "Deployment complete!"

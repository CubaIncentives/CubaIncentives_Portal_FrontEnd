#!/bin/bash
# Script to run pnpm install and pnpm build

# Load environment variables
. ~/.bashrc

# Run pnpm install
echo "Running pnpm install..."
pnpm install || { echo "pnpm install failed"; exit 1; }

# Run pnpm build
echo "Running pnpm build..."
pnpm build || { echo "pnpm build failed"; exit 1; }

# Output completion message
echo "Installation and build completed successfully!"

# Check if the dist directory exists
if [ ! -d "dist" ]; then
  echo "dist directory does not exist. Exiting..."
  exit 1
fi

# Delete old files and copy new files
BASENAME=$(basename "$PWD")

  echo "Deleting all files"
  echo "Copying files from dist"
if [ "$BASENAME" = "CubaIncentives_Portal_BackEnd" ]; then
  rm -rf ~/public_html/dev-backend.cubaincentives.com/*
  cp -nrf dist/* ~/public_html/dev-portal.cubaincentives.com
elif [ "$BASENAME" = "Prod_CubaIncentives_Portal_BackEnd" ]; then
  rm -rf ~/public_html/staging-backend.cubaincentives.com/*
  cp -nrf dist/* ~/public_html/staging-portal.cubaincentives.com
fi

echo "Files copied successfully!"

#!/bin/bash
# Script to run pnpm install and pnpm build

# Run pnpm install
source ~/.bashrc

echo "Running pnpm install..."
pnpm install

# Run pnpm build
echo "Running pnpm build..."
pnpm build

# Output completion message
echo "Installation and build completed successfully!"

# Copy all files from dist to ~/public_html/
echo "Copying files from dist to public_html"
cp -r dist/* ~/public_html/dev-portal.cubaincentives.com

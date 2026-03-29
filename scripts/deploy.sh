#!/bin/bash

# VibeFello Deployment Script
# Usage: ./scripts/deploy.sh [staging|production]

set -e

ENV=${1:-staging}
echo "🚀 Deploying VibeFello to $ENV environment..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Installing...${NC}"
    npm i -g vercel
fi

# Run tests
echo -e "${YELLOW}🧪 Running tests...${NC}"
npm test

# Build
echo -e "${YELLOW}📦 Building...${NC}"
npm run build

# Check build success
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Deploy to Vercel
if [ "$ENV" = "production" ]; then
    echo -e "${YELLOW}🚀 Deploying to PRODUCTION...${NC}"
    vercel --prod
else
    echo -e "${YELLOW}🚀 Deploying to STAGING...${NC}"
    vercel
fi

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "🔗 Check your deployment at:"
echo "   - Production: https://vibefello.com"
echo "   - Staging: https://vibefello-git-main-yourusername.vercel.app"

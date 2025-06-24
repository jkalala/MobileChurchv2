#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Finding Mobile Church App Project Root${NC}"
echo -e "${BLUE}=======================================${NC}"

echo -e "${YELLOW}📍 Current location:${NC}"
pwd

echo -e "\n${YELLOW}📁 Files in current directory:${NC}"
ls -la

echo -e "\n${BLUE}🔍 Looking for project indicators...${NC}"

# Check for key project files
PROJECT_FILES=("package.json" "next.config.mjs" "tailwind.config.ts" "app" "components")
FOUND_FILES=()

for file in "${PROJECT_FILES[@]}"; do
    if [ -e "$file" ]; then
        FOUND_FILES+=("$file")
        echo -e "${GREEN}✅ Found: $file${NC}"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
    fi
done

# Check if this looks like the project root
if [ ${#FOUND_FILES[@]} -ge 3 ]; then
    echo -e "\n${GREEN}🎉 You are in the project root directory!${NC}"
    echo -e "${GREEN}📍 Project root: $(pwd)${NC}"
    
    # Check if it's a git repository
    if [ -d ".git" ]; then
        echo -e "${GREEN}✅ Git repository detected${NC}"
        echo -e "${BLUE}🌿 Current branch: $(git branch --show-current)${NC}"
    else
        echo -e "${YELLOW}⚠️  Not a git repository yet${NC}"
        echo -e "${YELLOW}💡 You may need to run: git init${NC}"
    fi
    
    echo -e "\n${BLUE}🚀 Ready to run the test branch script!${NC}"
    echo -e "${GREEN}Run: chmod +x scripts/create-test-branch.sh && ./scripts/create-test-branch.sh${NC}"
    
else
    echo -e "\n${RED}❌ This doesn't look like the project root${NC}"
    echo -e "${YELLOW}💡 Try these commands to find it:${NC}"
    echo -e "   ${BLUE}find ~ -name 'package.json' -path '*/mobile-church-app/*' 2>/dev/null${NC}"
    echo -e "   ${BLUE}find ~ -name 'MobileChurch' -type d 2>/dev/null${NC}"
    echo -e "   ${BLUE}find ~ -name '*church*' -type d 2>/dev/null${NC}"
fi

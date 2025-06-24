#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Mobile Church App - Test Branch Creation${NC}"
echo -e "${BLUE}==========================================${NC}"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    echo -e "${YELLOW}💡 Make sure you're in the project root directory${NC}"
    exit 1
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${BLUE}📍 Current branch: ${YELLOW}$CURRENT_BRANCH${NC}"

# Stash any uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}💾 Stashing uncommitted changes...${NC}"
    git stash push -m "Auto-stash before creating test branch"
fi

# Create and switch to test branch
echo -e "${BLUE}🔄 Creating test/ci-cd-pipeline branch...${NC}"
if git checkout -b test/ci-cd-pipeline 2>/dev/null; then
    echo -e "${GREEN}✅ Successfully created and switched to test/ci-cd-pipeline${NC}"
else
    echo -e "${YELLOW}⚠️  Branch already exists, switching to it...${NC}"
    git checkout test/ci-cd-pipeline
fi

# Check if test files exist
echo -e "${BLUE}📁 Checking for test files...${NC}"

# List of files to add
FILES_TO_ADD=(
    "__tests__/"
    ".github/"
    ".lighthouserc.json"
    "jest.config.js"
    "jest.setup.js"
    "test-pr-description.md"
    "BRANCH_CREATION_GUIDE.md"
    "scripts/create-test-branch.sh"
)

# Add files that exist
ADDED_FILES=()
for file in "${FILES_TO_ADD[@]}"; do
    if [ -e "$file" ]; then
        git add "$file"
        ADDED_FILES+=("$file")
        echo -e "${GREEN}✅ Added: $file${NC}"
    else
        echo -e "${YELLOW}⚠️  File not found: $file${NC}"
    fi
done

# Check if any files were added
if [ ${#ADDED_FILES[@]} -eq 0 ]; then
    echo -e "${RED}❌ No test files found to add${NC}"
    echo -e "${YELLOW}💡 Make sure the test files are created first${NC}"
    exit 1
fi

# Show git status
echo -e "${BLUE}📊 Git status:${NC}"
git status --short

# Commit with detailed message
echo -e "${BLUE}💾 Committing changes...${NC}"
git commit -m "🧪 Add comprehensive CI/CD tests for Angola edition

✅ Test Coverage Added:
- Authentication component tests (Portuguese localization)
- Language selector tests (Angola flag, PT/EN/FR switching)
- Mobile navigation tests (responsive design, touch targets)

🔧 CI/CD Pipeline Features:
- GitHub Actions workflow with quality gates
- ESLint, TypeScript, Jest testing
- Security scanning (npm audit, Snyk)
- Vercel staging/production deployments
- Lighthouse mobile performance testing
- Dependabot auto-merge for dependencies

🇦🇴 Angola-Specific Validations:
- Portuguese as default language
- Angolan Kwanza (Kz) currency formatting
- +244 phone number format validation
- Mobile-first design with 44px+ touch targets
- Cultural context in PR templates

🚀 Deployment Strategy:
- develop → staging deployment
- main → production deployment
- PR previews with automated comments
- Database migrations with backups

📱 Mobile Optimization:
- Lighthouse CI for performance testing
- Touch-friendly interface validation
- Responsive design across devices
- Fast loading on mobile networks

Ready for Angola's church communities! 🙏"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully committed changes!${NC}"
else
    echo -e "${RED}❌ Failed to commit changes${NC}"
    exit 1
fi

# Show next steps
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo -e "${GREEN}1. Push to GitHub:${NC} git push -u origin test/ci-cd-pipeline"
echo -e "${GREEN}2. Create PR:${NC} Use the content from test-pr-description.md"
echo -e "${GREEN}3. Monitor CI/CD:${NC} Watch GitHub Actions execute"
echo -e "${GREEN}4. Test Preview:${NC} Verify staging deployment URL"

echo -e "${BLUE}🚀 Test branch created successfully!${NC}"
echo -e "${YELLOW}Ready to push to GitHub and trigger CI/CD pipeline! 🇦🇴🙏${NC}"

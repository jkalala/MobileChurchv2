# 🚀 Script Execution Guide

## 📋 **How to Run create-test-branch.sh**

### **Method 1: Direct Execution (Recommended)**
\`\`\`bash
# Make the script executable
chmod +x scripts/create-test-branch.sh

# Run the script
./scripts/create-test-branch.sh
\`\`\`

### **Method 2: Using npm script**
\`\`\`bash
npm run create-test-branch
\`\`\`

### **Method 3: Using the helper script**
\`\`\`bash
chmod +x scripts/run-test-branch.sh
./scripts/run-test-branch.sh
\`\`\`

## 🔍 **Troubleshooting**

### **Permission Denied Error**
\`\`\`bash
# If you get "Permission denied"
chmod +x scripts/create-test-branch.sh
./scripts/create-test-branch.sh
\`\`\`

### **Script Not Found**
\`\`\`bash
# Make sure you're in the project root
pwd
ls scripts/

# If scripts folder doesn't exist
mkdir -p scripts
# Then recreate the script file
\`\`\`

### **Git Repository Error**
\`\`\`bash
# Make sure you're in a git repository
git status

# If not initialized
git init
git remote add origin YOUR_REPO_URL
\`\`\`

## 📊 **What the Script Does**

1. **🔍 Checks**: Verifies git repository and current branch
2. **💾 Stashes**: Saves any uncommitted changes
3. **🌿 Creates**: New branch `test/ci-cd-pipeline`
4. **📁 Adds**: All test files and CI/CD configuration
5. **💾 Commits**: With comprehensive commit message
6. **📋 Shows**: Next steps for pushing to GitHub

## 🎯 **Expected Output**

\`\`\`bash
🚀 Mobile Church App - Test Branch Creation
==========================================
📍 Current branch: main
🔄 Creating test/ci-cd-pipeline branch...
✅ Successfully created and switched to test/ci-cd-pipeline
📁 Checking for test files...
✅ Added: __tests__/
✅ Added: .github/
✅ Added: .lighthouserc.json
✅ Added: jest.config.js
✅ Added: jest.setup.js
💾 Committing changes...
✅ Successfully committed changes!

🎯 Next Steps:
1. Push to GitHub: git push -u origin test/ci-cd-pipeline
2. Create PR: Use the content from test-pr-description.md
3. Monitor CI/CD: Watch GitHub Actions execute
4. Test Preview: Verify staging deployment URL

🚀 Test branch created successfully!
Ready to push to GitHub and trigger CI/CD pipeline! 🇦🇴🙏
\`\`\`

## 🚀 **After Running the Script**

### **Step 1: Push to GitHub**
\`\`\`bash
git push -u origin test/ci-cd-pipeline
\`\`\`

### **Step 2: Create Pull Request**
1. Go to your GitHub repository
2. Click "Compare & pull request"
3. Use the title and description from `test-pr-description.md`
4. Create the PR

### **Step 3: Monitor CI/CD**
- Watch GitHub Actions tab
- Verify all checks pass
- Check the preview URL in PR comments

## 🇦🇴 **Angola-Specific Validation**

The script creates tests that validate:
- ✅ Portuguese as default language
- ✅ Kwanza (Kz) currency formatting
- ✅ +244 phone number format
- ✅ Mobile-first design
- ✅ Touch-friendly interface

Ready to deploy for Angola's church communities! 🙏

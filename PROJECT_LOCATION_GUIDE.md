# 📍 Finding Your Project Root Directory

## 🎯 **Quick Check - Are You Already There?**

Run this command to check if you're in the right place:
\`\`\`bash
ls -la
\`\`\`

**✅ You're in the project root if you see:**
- `package.json`
- `app/` folder
- `components/` folder  
- `next.config.mjs`
- `tailwind.config.ts`

## 🔍 **Method 1: Use the Finder Script**
\`\`\`bash
chmod +x scripts/find-project-root.sh
./scripts/find-project-root.sh
\`\`\`

## 🔍 **Method 2: Manual Search**

### **On macOS/Linux:**
\`\`\`bash
# Search for the project by name
find ~ -name "*church*" -type d 2>/dev/null
find ~ -name "*mobile*" -type d 2>/dev/null
find ~ -name "MobileChurch" -type d 2>/dev/null

# Search for package.json files
find ~ -name "package.json" -exec grep -l "mobile-church-app" {} \; 2>/dev/null
\`\`\`

### **On Windows (Git Bash/PowerShell):**
\`\`\`bash
# Search in common locations
dir /s /b C:\Users\%USERNAME%\*church* 2>nul
dir /s /b C:\Users\%USERNAME%\*mobile* 2>nul

# Or use PowerShell
Get-ChildItem -Path $env:USERPROFILE -Recurse -Directory -Name "*church*" -ErrorAction SilentlyContinue
\`\`\`

## 📁 **Common Project Locations**

Your project is likely in one of these places:

### **Desktop:**
\`\`\`bash
cd ~/Desktop/mobile-church-app
# or
cd ~/Desktop/MobileChurch
\`\`\`

### **Documents:**
\`\`\`bash
cd ~/Documents/mobile-church-app
cd ~/Documents/Projects/mobile-church-app
\`\`\`

### **Development Folder:**
\`\`\`bash
cd ~/Development/mobile-church-app
cd ~/Code/mobile-church-app
cd ~/Projects/mobile-church-app
\`\`\`

### **Downloads (if recently downloaded):**
\`\`\`bash
cd ~/Downloads/mobile-church-app
cd ~/Downloads/MobileChurch-main
\`\`\`

## 🚀 **Once You Find It:**

1. **Navigate to the directory:**
   \`\`\`bash
   cd /path/to/your/mobile-church-app
   \`\`\`

2. **Verify you're in the right place:**
   \`\`\`bash
   pwd
   ls -la
   \`\`\`

3. **Run the test branch script:**
   \`\`\`bash
   chmod +x scripts/create-test-branch.sh
   ./scripts/create-test-branch.sh
   \`\`\`

## 🆘 **Still Can't Find It?**

### **Option 1: Clone from GitHub**
If you have the GitHub repository:
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/MobileChurch.git
cd MobileChurch
\`\`\`

### **Option 2: Create New Project**
If you need to start fresh:
\`\`\`bash
mkdir mobile-church-app
cd mobile-church-app
# Then copy the project files here
\`\`\`

### **Option 3: Use VS Code**
If you have VS Code:
1. Open VS Code
2. File → Open Folder
3. Look for your project folder
4. Open Terminal in VS Code (Ctrl+`)

## 🎯 **Quick Commands to Try:**

\`\`\`bash
# Check current location
pwd

# List files to see if you're in project root
ls -la

# Search for project
find ~ -name "package.json" -path "*church*" 2>/dev/null

# Navigate to likely locations
cd ~/Desktop && ls | grep -i church
cd ~/Documents && ls | grep -i church
cd ~/Downloads && ls | grep -i church
\`\`\`

Once you find your project directory, you'll be ready to run the CI/CD test branch creation! 🇦🇴🙏

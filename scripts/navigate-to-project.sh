#!/bin/bash

echo "🔍 Searching for Mobile Church App project..."

# Common locations to check
SEARCH_PATHS=(
    "$HOME/Desktop"
    "$HOME/Documents" 
    "$HOME/Projects"
    "$HOME/Development"
    "$HOME/Code"
    "$HOME"
    "."
)

# Project identifiers
PROJECT_NAMES=(
    "mobile-church-app"
    "MobileChurch" 
    "church-app"
    "smart-church-app"
)

echo "📁 Searching in common locations..."

for path in "${SEARCH_PATHS[@]}"; do
    if [ -d "$path" ]; then
        echo "🔍 Checking: $path"
        
        for project in "${PROJECT_NAMES[@]}"; do
            if [ -d "$path/$project" ]; then
                echo "🎉 Found project at: $path/$project"
                echo "📍 To navigate there, run:"
                echo "   cd '$path/$project'"
                echo ""
            fi
        done
        
        # Also search for directories containing package.json with mobile-church-app
        find "$path" -maxdepth 3 -name "package.json" -exec grep -l "mobile-church-app\|church" {} \; 2>/dev/null | while read file; do
            dir=$(dirname "$file")
            echo "🎯 Possible project found at: $dir"
            echo "   cd '$dir'"
            echo ""
        done
    fi
done

echo "💡 If not found, the project might be in:"
echo "   - Your Downloads folder"
echo "   - A different drive (Windows: C:, D:, etc.)"
echo "   - A cloud folder (OneDrive, Google Drive, etc.)"

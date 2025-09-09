#!/bin/bash

echo "=== COMPREHENSIVE URL TRAILING SLASH ANALYSIS ==="
echo ""

# Function to check a single URL
check_url() {
    local url="$1"
    local page_name="$2"
    
    echo "🔍 Checking: $page_name"
    echo "URL: $url"
    echo "---"
    
    # Get the page content
    content=$(curl -s "$url" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        # Extract all href attributes and clean them
        hrefs=$(echo "$content" | grep -o 'href="[^"]*"' | sed 's/href="//g' | sed 's/"//g' | sort | uniq)
        
        echo "📊 Total Links Found: $(echo "$hrefs" | wc -l | tr -d ' ')"
        echo ""
        
        # Categorize links
        echo "�� Link Analysis:"
        echo ""
        
        # Root URLs (should have trailing slash)
        echo "🏠 Root URLs (should have trailing slash):"
        echo "$hrefs" | grep -E '^https://olake\.io/?$' | while read link; do
            if [[ "$link" == "https://olake.io/" ]]; then
                echo "  ✅ $link (correct)"
            else
                echo "  ❌ $link (missing trailing slash)"
            fi
        done
        echo ""
        
        # Directory URLs (should have trailing slash)
        echo "📁 Directory URLs (should have trailing slash):"
        echo "$hrefs" | grep -E '^/[^/]*/?$' | grep -v -E '\.(css|js|xml|svg|png|jpg|jpeg|gif|ico)$' | while read link; do
            if [[ "$link" == */ ]]; then
                echo "  ✅ $link (correct)"
            else
                echo "  ❌ $link (missing trailing slash)"
            fi
        done
        echo ""
        
        # File URLs (should NOT have trailing slash)
        echo "📄 File URLs (should NOT have trailing slash):"
        echo "$hrefs" | grep -E '\.(css|js|xml|svg|png|jpg|jpeg|gif|ico)$' | while read link; do
            if [[ "$link" != */ ]]; then
                echo "  ✅ $link (correct)"
            else
                echo "  ❌ $link (has trailing slash - incorrect)"
            fi
        done
        echo ""
        
        # External URLs
        echo "🌐 External URLs:"
        echo "$hrefs" | grep -E '^https?://' | grep -v 'olake.io' | head -5 | while read link; do
            echo "  🔗 $link"
        done
        echo ""
        
    else
        echo "❌ Error: Could not access page"
    fi
    
    echo "================================================"
    echo ""
}

# Check all pages
check_url "http://localhost:3000/" "Homepage"
check_url "http://localhost:3000/blog" "Blog Index"
check_url "http://localhost:3000/blog/what-makes-olake-fast" "Blog: What makes OLake fast?"
check_url "http://localhost:3000/docs" "Documentation Index"
check_url "http://localhost:3000/docs/getting-started/quick-start" "Docs: Quick Start"
check_url "http://localhost:3000/iceberg" "Iceberg Index"
check_url "http://localhost:3000/iceberg/apache-iceberg-vs-delta-lake-guide" "Iceberg: Apache Iceberg vs Delta Lake"


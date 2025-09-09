#!/bin/bash

echo "=== COMPREHENSIVE URL TRAILING SLASH ANALYSIS ==="
echo ""

# Function to analyze a single URL
analyze_url() {
    local url="$1"
    local page_name="$2"
    
    echo "🔍 Analyzing: $page_name"
    echo "URL: $url"
    echo "---"
    
    # Get the page content
    content=$(curl -s "$url" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        # Extract all href attributes
        hrefs=$(echo "$content" | grep -o 'href="[^"]*"' | sed 's/href="//g' | sed 's/"//g' | sort | uniq)
        
        echo "📊 Total Links Found: $(echo "$hrefs" | wc -l | tr -d ' ')"
        echo ""
        
        # Categorize and analyze each link
        echo "📋 Detailed Link Analysis:"
        echo ""
        
        # Root URLs
        echo "🏠 Root URLs:"
        echo "$hrefs" | grep -E '^https://olake\.io/?$' | while read link; do
            if [[ "$link" == "https://olake.io/" ]]; then
                echo "  ✅ $link (CORRECT - has trailing slash)"
            else
                echo "  ❌ $link (INCORRECT - missing trailing slash)"
            fi
        done
        echo ""
        
        # Directory URLs (should have trailing slash)
        echo "📁 Directory URLs (should have trailing slash):"
        echo "$hrefs" | grep -E '^/[^/]*/?$' | grep -v -E '\.(css|js|xml|svg|png|jpg|jpeg|gif|ico)$' | while read link; do
            if [[ "$link" == */ ]]; then
                echo "  ✅ $link (CORRECT - has trailing slash)"
            else
                echo "  ❌ $link (INCORRECT - missing trailing slash)"
            fi
        done
        echo ""
        
        # File URLs (should NOT have trailing slash)
        echo "📄 File URLs (should NOT have trailing slash):"
        echo "$hrefs" | grep -E '\.(css|js|xml|svg|png|jpg|jpeg|gif|ico)$' | while read link; do
            if [[ "$link" != */ ]]; then
                echo "  ✅ $link (CORRECT - no trailing slash)"
            else
                echo "  ❌ $link (INCORRECT - has trailing slash)"
            fi
        done
        echo ""
        
        # Navigation links (should NOT have trailing slash)
        echo "🧭 Navigation Links (should NOT have trailing slash):"
        echo "$hrefs" | grep -E '^/(docs|blog|iceberg|ai-lake|webinar|community|search)(/|$)' | grep -v -E '\.(css|js|xml|svg|png|jpg|jpeg|gif|ico)$' | while read link; do
            if [[ "$link" != */ ]]; then
                echo "  ✅ $link (CORRECT - no trailing slash for navigation)"
            else
                echo "  ❌ $link (INCORRECT - has trailing slash for navigation)"
            fi
        done
        echo ""
        
        # External URLs
        echo "🌐 External URLs:"
        echo "$hrefs" | grep -E '^https?://' | grep -v 'olake.io' | head -5 | while read link; do
            echo "  🔗 $link (External - format varies)"
        done
        echo ""
        
    else
        echo "❌ Error: Could not access page"
    fi
    
    echo "================================================"
    echo ""
}

# Check all pages
analyze_url "http://localhost:3000/" "Homepage"
analyze_url "http://localhost:3000/blog" "Blog Index"
analyze_url "http://localhost:3000/blog/what-makes-olake-fast" "Blog: What makes OLake fast?"
analyze_url "http://localhost:3000/blog/olake-architecture-deep-dive" "Blog: Architecture Deep Dive"
analyze_url "http://localhost:3000/blog/mongodb-cdc-using-debezium-and-kafka" "Blog: MongoDB CDC"
analyze_url "http://localhost:3000/blog/debezium-vs-olake" "Blog: Debezium vs OLake"
analyze_url "http://localhost:3000/blog/how-to-set-up-postgresql-cdc-on-aws-rds" "Blog: PostgreSQL CDC"
analyze_url "http://localhost:3000/docs" "Documentation Index"
analyze_url "http://localhost:3000/docs/getting-started/quick-start" "Docs: Quick Start"
analyze_url "http://localhost:3000/docs/connectors/mongodb/overview" "Docs: MongoDB Connector"
analyze_url "http://localhost:3000/docs/connectors/postgres/overview" "Docs: PostgreSQL Connector"
analyze_url "http://localhost:3000/iceberg" "Iceberg Index"
analyze_url "http://localhost:3000/iceberg/apache-iceberg-vs-delta-lake-guide" "Iceberg: Apache vs Delta"
analyze_url "http://localhost:3000/iceberg/data-lake-vs-delta-lake" "Iceberg: Data Lake vs Delta"


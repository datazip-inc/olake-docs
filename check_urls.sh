#!/bin/bash

# Array of URLs to check
urls=(
    "http://localhost:3000/"
    "http://localhost:3000/blog"
    "http://localhost:3000/blog/what-makes-olake-fast"
    "http://localhost:3000/blog/olake-architecture-deep-dive"
    "http://localhost:3000/blog/mongodb-cdc-using-debezium-and-kafka"
    "http://localhost:3000/blog/debezium-vs-olake"
    "http://localhost:3000/blog/how-to-set-up-postgresql-cdc-on-aws-rds"
    "http://localhost:3000/docs"
    "http://localhost:3000/docs/getting-started/quick-start"
    "http://localhost:3000/docs/connectors/mongodb/overview"
    "http://localhost:3000/docs/connectors/postgres/overview"
    "http://localhost:3000/iceberg"
    "http://localhost:3000/iceberg/apache-iceberg-vs-delta-lake-guide"
    "http://localhost:3000/iceberg/data-lake-vs-delta-lake"
)

echo "URL,Status,Has Trailing Slash Issues,Link Count,Issues Found"
echo "---,---,---,---,---"

for url in "${urls[@]}"; do
    # Get the page content
    content=$(curl -s "$url" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        status="✅ OK"
        
        # Extract all href attributes
        hrefs=$(echo "$content" | grep -o 'href="[^"]*"' | sed 's/href="//g' | sed 's/"//g')
        
        # Count total links
        link_count=$(echo "$hrefs" | wc -l | tr -d ' ')
        
        # Check for trailing slash issues
        issues=""
        has_issues="No"
        
        # Check for problematic patterns
        if echo "$hrefs" | grep -q "href=\"[^/][^/]*[^/]\"[^/]" 2>/dev/null; then
            has_issues="Yes"
            issues="Potential trailing slash issues found"
        fi
        
        # Check for specific problematic patterns
        problematic_links=$(echo "$hrefs" | grep -E '^/[^/]*[^/]$' | grep -v -E '\.(css|js|xml|svg|png|jpg|jpeg|gif|ico)$')
        if [ ! -z "$problematic_links" ]; then
            has_issues="Yes"
            issues="Root-level links without trailing slash: $(echo "$problematic_links" | head -3 | tr '\n' ' ')"
        fi
        
        echo "$url,$status,$has_issues,$link_count,$issues"
    else
        echo "$url,❌ Error,Unknown,0,Page not accessible"
    fi
done

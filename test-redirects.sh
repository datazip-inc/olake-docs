#!/bin/bash

# Test Cloudflare Server-Side Redirects
# This script tests if redirects are working at the Cloudflare/CDN level

echo "Testing Cloudflare Server-Side Redirects..."
echo "=========================================="
echo ""

# Test a few redirects
test_redirect() {
    local source_url=$1
    local expected_target=$2
    
    echo "Testing: $source_url"
    echo "Expected: $expected_target"
    
    # Use curl to get headers only (no body)
    response=$(curl -sI -L "$source_url" 2>&1)
    
    # Check HTTP status code
    status_code=$(echo "$response" | grep -i "HTTP/" | tail -1 | awk '{print $2}')
    
    # Check Location header
    location=$(echo "$response" | grep -i "location:" | tail -1 | sed 's/location: //i' | tr -d '\r')
    
    # Check if redirected
    if [ "$status_code" = "301" ] || [ "$status_code" = "302" ]; then
        echo "✅ Status: $status_code (Redirect working!)"
        echo "   Location: $location"
        
        # Verify it matches expected target
        if echo "$location" | grep -q "$expected_target"; then
            echo "   ✅ Target matches expected"
        else
            echo "   ⚠️  Target doesn't match expected: $expected_target"
        fi
    elif [ "$status_code" = "200" ]; then
        echo "❌ Status: 200 (No redirect - might be client-side only)"
        echo "   This suggests the redirect is handled by Docusaurus, not Cloudflare"
    else
        echo "❌ Status: $status_code (Unexpected)"
    fi
    
    echo ""
}

# Test some redirects
echo "1. Testing connector benchmarks redirect:"
test_redirect "https://olake.io/docs/connectors/mongodb/benchmarks" "docs/benchmarks?tab=mongodb"

echo "2. Testing old olake/mongodb redirect:"
test_redirect "https://olake.io/olake/mongodb" "docs"

echo "3. Testing old blog post redirect:"
test_redirect "https://olake.io/blog/top-mongodb-etl-tools-a-comprehensive-guide-to-syncing-your-nosql-data" "blog"

echo "4. Testing category redirect:"
test_redirect "https://olake.io/docs/category/mongodb" "docs/connectors/mongodb/overview"

echo "5. Testing connectors redirect:"
test_redirect "https://olake.io/docs/connectors" "docs/connectors/overview"

echo ""
echo "=========================================="
echo "Test Complete!"
echo ""
echo "What to look for:"
echo "- Status 301 = Server-side redirect working ✅"
echo "- Status 200 = Client-side only (Docusaurus) ❌"
echo "- Location header should show the target URL"



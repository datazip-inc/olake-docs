#!/bin/bash

echo "=========================================="
echo "Cloudflare Proxying Verification"
echo "=========================================="
echo ""

# Check DNS resolution
echo "1. Checking DNS resolution:"
DNS_RESULT=$(dig +short olake.io | head -1)
echo "   Current IP: $DNS_RESULT"

if [[ $DNS_RESULT == 185.199.* ]]; then
    echo "   ❌ Still resolving to GitHub Pages (185.199.x.x)"
    echo "   → Cloudflare is NOT proxying"
elif [[ $DNS_RESULT == 104.* ]] || [[ $DNS_RESULT == 172.* ]]; then
    echo "   ✅ Resolving to Cloudflare IP ($DNS_RESULT)"
    echo "   → Cloudflare is proxying"
else
    echo "   ⚠️  Unknown IP: $DNS_RESULT"
fi

echo ""

# Check HTTP headers
echo "2. Checking HTTP headers:"
HEADERS=$(curl -sI "https://olake.io/" | head -10)

if echo "$HEADERS" | grep -q "cf-ray"; then
    CF_RAY=$(echo "$HEADERS" | grep -i "cf-ray" | head -1)
    echo "   ✅ Cloudflare header found: $CF_RAY"
    echo "   → Cloudflare is proxying"
elif echo "$HEADERS" | grep -qi "server: cloudflare"; then
    SERVER=$(echo "$HEADERS" | grep -i "server:" | head -1)
    echo "   ✅ Cloudflare server: $SERVER"
    echo "   → Cloudflare is proxying"
elif echo "$HEADERS" | grep -qi "server: github"; then
    echo "   ❌ Server: GitHub.com"
    echo "   → Cloudflare is NOT proxying"
else
    echo "   ⚠️  Could not determine server"
fi

echo ""

# Test a redirect
echo "3. Testing redirect:"
REDIRECT_TEST=$(curl -sI -L --max-redirs 0 "https://olake.io/docs/connectors/mongodb/benchmarks/" | head -5)
STATUS=$(echo "$REDIRECT_TEST" | grep -i "HTTP/" | head -1 | awk '{print $2}')

if [ "$STATUS" = "301" ] || [ "$STATUS" = "302" ]; then
    LOCATION=$(echo "$REDIRECT_TEST" | grep -i "location:" | head -1)
    echo "   ✅ Redirect working! Status: $STATUS"
    echo "   Location: $LOCATION"
elif [ "$STATUS" = "200" ]; then
    echo "   ❌ No redirect (Status: 200)"
    echo "   → Redirects won't work until Cloudflare proxies traffic"
else
    echo "   ⚠️  Status: $STATUS"
fi

echo ""
echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "If Cloudflare is NOT proxying:"
echo "1. Go to Cloudflare Dashboard → DNS → Records"
echo "2. Ensure all A records show ORANGE cloud (Proxied)"
echo "3. Go to Overview → Check nameservers are set at registrar"
echo "4. Wait 10-15 minutes for DNS propagation"
echo ""
echo "If Cloudflare IS proxying but redirects don't work:"
echo "1. Go to Rules → Bulk Redirects"
echo "2. Verify Bulk Redirect Rule is enabled"
echo "3. Check redirect list is associated with the rule"
echo ""










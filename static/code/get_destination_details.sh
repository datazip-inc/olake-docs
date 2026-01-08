#!/bin/bash

# ============================================================================
# CONFIGURATION: Edit this section to customize the script
# ============================================================================

# API endpoint base URL
# Example: BASE_URL="http://localhost:8000"
#          BASE_URL="http://api.example.com"
BASE_URL="http://localhost:8000"

# OLake credentials
# Example: USERNAME="admin"
#          PASSWORD="your_password"
USERNAME="admin"
PASSWORD="password"

# Job ID to query (can also be provided as command line argument)
# Example: JOB_ID=157
# Usage: ./get_destination_destination.sh [job_id]
#        If job_id is provided as argument, it overrides this value
JOB_ID=4

# ============================================================================

# Check if jq is available
if ! command -v jq &> /dev/null; then
    echo "Error: jq is required but not installed. Please install jq to use this script."
    exit 1
fi

# Get job ID from command line argument if provided, otherwise use script variable
if [ -n "$1" ]; then
    JOB_ID="$1"
fi

# Check if job ID is specified
if [ -z "$JOB_ID" ] || [ "$JOB_ID" == "" ]; then
    echo "Error: Please specify a job ID either in the script (JOB_ID variable) or as a command line argument."
    echo "Usage: $0 [job_id]"
    exit 1
fi

# Login and save cookies
echo "Logging in to $BASE_URL..."
curl --location "$BASE_URL/login" \
  --header 'Content-Type: application/json' \
  --data "{
    \"username\": \"$USERNAME\",
    \"password\": \"$PASSWORD\"
  }" \
  -c cookies.txt \
  -s > /dev/null

# Get jobs data and save to temporary file
echo "Fetching jobs data for job ID: $JOB_ID..."
RESPONSE_FILE=$(mktemp)
curl --location "$BASE_URL/api/v1/project/123/jobs" \
  --header 'Content-Type: application/json' \
  -b cookies.txt \
  -s > "$RESPONSE_FILE"

# Extract and save destination.config as parsed JSON (single object, not array)
OUTPUT_FILE="destination.json"
jq -r ".data[]? | select(.id == $JOB_ID) | 
  .destination.config // \"\" |
  if type == \"string\" and length > 0 then
    fromjson
  else
    {}
  end" "$RESPONSE_FILE" 2>/dev/null > "$OUTPUT_FILE"

echo "Results saved to: $OUTPUT_FILE"

# Cleanup
rm -f "$RESPONSE_FILE" cookies.txt
#!/bin/bash

# Defining variables
DIST_DIR="dist"
LAMBDA_ZIP="get_jobboards.zip"
S3_BUCKET="jobs-cse"
S3_PATH="lambda/connectors/$LAMBDA_ZIP"

# Navigate to the dist directory
cd "$DIST_DIR"

# Zip the Lambda function
echo "Zipping the Lambda function..."
zip -r $LAMBDA_ZIP index.js
echo "Lambda function zip completed."

# Upload to S3
echo "Uploading $LAMBDA_ZIP to S3..."
aws s3 cp $LAMBDA_ZIP s3://$S3_BUCKET/$S3_PATH
echo "Upload completed."

# Cleanup
echo "Cleaning up..."
rm $LAMBDA_ZIP

echo "Deployment of Lambda function completed successfully."

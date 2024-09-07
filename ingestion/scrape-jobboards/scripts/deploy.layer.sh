#!/bin/bash

# Definings variables
DIST_DIR="dist"
LAYER_DIR="nodejs"
LAYER_ZIP="scrape_jobboard_layer.zip"
S3_BUCKET="jobs-cse"
S3_PATH="lambda/ingestion/$LAYER_ZIP"

# Navigate to the dist directory where the layer directory is located
cd "$DIST_DIR"

# Zip the Lambda layer
echo "Zipping the Lambda layer..."
zip -r $LAYER_ZIP $LAYER_DIR
echo "Lambda layer zip completed."

# Upload to S3
echo "Uploading $LAYER_ZIP to S3..."
aws s3 cp $LAYER_ZIP s3://$S3_BUCKET/$S3_PATH
echo "Upload completed."

# Cleanup
echo "Cleaning up..."
rm $LAYER_ZIP

echo "Deployment of Lambda layer completed successfully."

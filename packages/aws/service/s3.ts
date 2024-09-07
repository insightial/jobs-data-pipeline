import * as fs from "fs";
import * as AWS from "aws-sdk";
import { AWSError } from "aws-sdk";
import { S3 } from "aws-sdk";

const s3 = new AWS.S3();

/**
 * Saves data to a file with the given extension.
 *
 * @param data - Data to be saved.
 * @param filePath - Path to the file without the extension.
 * @param fileExtension - File extension to be used.
 */
export function saveToFile(
  data: string,
  filePath: string,
  fileExtension: string
): void {
  const fullPath = `${filePath}.${fileExtension}`;
  fs.writeFileSync(fullPath, data, { encoding: "utf-8" });
  console.log(`Data successfully saved to ${fullPath}`);
}

/**
 * Uploads a file to an AWS S3 bucket.
 *
 * @param filePath - Local path to the file.
 * @param bucketName - Name of the S3 bucket.
 * @param s3Path - Path within the S3 bucket where the file will be saved.
 */
export async function uploadToS3(
  filePath: string,
  bucketName: string,
  s3Path: string
): Promise<void> {
  try {
    const params: S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: s3Path,
      Body: fs.createReadStream(filePath),
    };

    await s3.upload(params).promise();
    console.log(
      `File ${filePath} uploaded successfully to s3://${bucketName}/${s3Path}`
    );
  } catch (error) {
    const err = error as AWSError;
    console.error(`Failed to upload file to S3: ${err.message}`);
    throw err;
  }
}

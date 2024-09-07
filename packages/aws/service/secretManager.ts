import * as AWS from "aws-sdk";
import { AWSError } from "aws-sdk";

/**
 * Retrieve secrets from AWS Secrets Manager.
 *
 * @param secretName - Name of the secret to retrieve.
 * @param regionName - AWS region where the secret is stored.
 * @returns The value of the secret.
 */
export async function getSecret(
  secretName: string,
  regionName: string = "us-east-1"
): Promise<string | Uint8Array> {
  // Create a Secrets Manager client
  const client = new AWS.SecretsManager({ region: regionName });

  try {
    const data = await client
      .getSecretValue({ SecretId: secretName })
      .promise();

    if (data.SecretString) {
      return JSON.parse(data.SecretString).value;
    } else if (data.SecretBinary) {
      return data.SecretBinary as Uint8Array; // SecretBinary is Uint8Array by default
    }
    throw new Error("Secret format not recognized");
  } catch (error) {
    const err = error as AWSError;

    switch (err.code) {
      case "DecryptionFailureException":
        // Secrets Manager can't decrypt the secret using the provided KMS key.
        throw err;
      case "InternalServiceErrorException":
        // An error occurred on the server side.
        throw err;
      case "InvalidParameterException":
        // Invalid value for a parameter.
        throw err;
      case "InvalidRequestException":
        // Invalid request for the current state of the resource.
        throw err;
      case "ResourceNotFoundException":
        // The requested resource was not found.
        throw err;
      default:
        throw err;
    }
  }
}

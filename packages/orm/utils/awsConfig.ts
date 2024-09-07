import AWS from "aws-sdk";

// Import AWS SDK and destructure the required services
const { SecretsManager, RDS } = AWS;

// Set the AWS region
AWS.config.update({ region: "us-east-1" });

// Initialize the AWS SDK services
const secretsManager = new SecretsManager();
const rds = new RDS();

interface AuroraCredentials {
  username: string;
  password: string;
  endpoint: string;
}

/**
 * Fetches credentials and the database endpoint from AWS Secrets Manager and RDS service.
 */
export async function getDatabaseConfig(): Promise<AuroraCredentials> {
  const secretId = "jobs_listing_aurora_credentials";
  try {
    // Fetch credentials from Secrets Manager
    const secretsData = await secretsManager
      .getSecretValue({ SecretId: secretId })
      .promise();
    const credentials = JSON.parse(secretsData.SecretString || "{}");

    // Fetch database endpoint from RDS
    const params: AWS.RDS.Types.DescribeDBInstancesMessage = {
      DBInstanceIdentifier: "jobs-rds-instance",
    };
    const endpointData = await rds.describeDBInstances(params).promise();

    // Adding a check for undefined values
    if (!endpointData.DBInstances || endpointData.DBInstances.length === 0) {
      throw new Error("No DB instances found.");
    }

    const endpoint = endpointData.DBInstances[0].Endpoint?.Address;
    if (!endpoint) {
      throw new Error("Database endpoint is not available.");
    }

    return {
      username: encodeURIComponent(credentials.master_username),
      password: encodeURIComponent(credentials.master_password),
      endpoint: endpoint,
    };
  } catch (error) {
    console.error("Error retrieving database configuration:", error);
    throw error;
  }
}

export async function getPrismaDatabaseUrl() {
  try {
    // Fetch database configuration
    const config = await getDatabaseConfig();

    // Construct the DATABASE_URL
    const databaseUrl = `postgresql://${config.username}:${config.password}@${config.endpoint}/joblisting?schema=public`;
    return databaseUrl;
  } catch (error) {
    console.error("Error constructing DATABASE_URL:", error);
    throw error;
  }
}

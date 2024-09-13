import { SQSEvent } from "aws-lambda";
import { syncGreenhouseJobs } from "./greenhouse";
import { getPrismaDatabaseUrl } from "@insightial/job-prisma-schema/utils/awsConfig";

export const handler = async (event) => {
  const databaseUrl = await getPrismaDatabaseUrl();
  process.env.DATABASE_URL = databaseUrl;

  try {
    // Iterate over each SQS message
    for (const record of event.Records) {
      const messageBody = JSON.parse(record.body);

      const { jobBoard } = messageBody;

      // Fetch job board results based on the message content
      const results = await syncGreenhouseJobs(jobBoard);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Results processed successfully" }),
    };
  } catch (error) {
    console.error(`Failed to process results: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Failed to process results: ${error}`,
      }),
    };
  }
};

const dummyEvent: SQSEvent = {
  Records: [
    {
      messageId: "123",
      receiptHandle: "456",
      body: JSON.stringify({
        jobBoard: "1021creative",
      }),
      attributes: {
        ApproximateReceiveCount: "1",
        SentTimestamp: "1641949100000",
        SenderId: "123456789012",
        ApproximateFirstReceiveTimestamp: "1641949100000",
        SequenceNumber: "18876504397463484129",
        MessageGroupId: "test",
      },
      messageAttributes: {},
      md5OfBody: "",
      eventSourceARN: "",
      eventSource: "aws:sqs",
      awsRegion: "us-east-1",
    },
  ],
};

if (process.env.IS_LOCAL) {
  console.log("Running in local environment.");
  handler(dummyEvent)
    .then((data) => console.log(data))
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(`Error: ${error}`);
    });
}

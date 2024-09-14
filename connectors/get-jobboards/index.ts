import { SQSEvent } from "aws-lambda";
import { syncGreenhouseJobs } from "./greenhouse";
import { syncLeverJobs } from "./lever";
import { getPrismaDatabaseUrl } from "@insightial/job-prisma-schema/utils/awsConfig";

export const handler = async (event: SQSEvent) => {
  const databaseUrl = await getPrismaDatabaseUrl();
  process.env.DATABASE_URL = databaseUrl;

  try {
    // Process all records in parallel
    await Promise.all(
      event.Records.map(async (record) => {
        const messageBody = JSON.parse(record.body);
        const { jobBoard, board } = messageBody;

        // Fetch job board results based on the message content
        if (board === "greenhouse") {
          await syncGreenhouseJobs(jobBoard);
        } else if (board === "lever") {
          await syncLeverJobs(jobBoard);
        }
      })
    );

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
        jobBoard: "askfavor",
        board: "lever",
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

import { SQSEvent } from "aws-lambda";
import { fetchJobBoards } from "./fetch";
import prisma from "@insightial/job-prisma-schema";
import { getPrismaDatabaseUrl } from "@insightial/job-prisma-schema/utils/awsConfig";

export const handler = async (event: SQSEvent) => {
  // Presuming the database URL is constant during the lambda lifecycle
  const databaseUrl = await getPrismaDatabaseUrl();
  process.env.DATABASE_URL = databaseUrl;

  try {
    const resultsToSave = [];

    // Iterate over each SQS message
    for (const record of event.Records) {
      const messageBody = JSON.parse(record.body);

      const { before, after, totalResults, resultsPerPage, startIndex } =
        messageBody;

      // Fetch job board results based on the message content
      const results = await fetchJobBoards(
        before,
        after,
        totalResults,
        resultsPerPage,
        startIndex
      );

      if (results) {
        resultsToSave.push(...results); // Collect all results to save in batch
      } else {
        console.error("Failed to fetch results for message:", record.messageId);
      }
    }

    // Save all results at once using Prisma's createMany
    if (resultsToSave.length > 0) {
      await prisma.jobBoard.createMany({
        data: resultsToSave,
        skipDuplicates: true,
      });
      console.log("Results saved successfully");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Results processed successfully" }),
    };
  } catch (error) {
    console.error(`Failed to process results: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to process results: ${error}` }),
    };
  }
};

// For local tesing
const dummyEvent: SQSEvent = {
  Records: [
    {
      messageId: "123",
      receiptHandle: "456",
      body: JSON.stringify({
        before: "2012-01-01",
        after: "1990-01-01",
        totalResults: 100,
        resultsPerPage: 10,
        startIndex: 1,
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

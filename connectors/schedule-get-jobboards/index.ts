import { SQS } from "aws-sdk";
import prisma from "@insightial/job-prisma-schema";
import { JobBoard } from "@prisma/client";
import { getPrismaDatabaseUrl } from "@insightial/job-prisma-schema/utils/awsConfig";

const sqs = new SQS();

export const handler = async () => {
  const databaseUrl = await getPrismaDatabaseUrl();
  process.env.DATABASE_URL = databaseUrl;

  // Fetch the SQS queue URL from environment variables
  const queueUrl = process.env.SQS_QUEUE_URL;

  if (!queueUrl) {
    throw new Error("SQS_QUEUE_URL environment variable is not set.");
  }

  try {
    // Fetch all entries from JobBoard table
    const jobBoards: JobBoard[] = await prisma.jobBoard.findMany();

    // Process messages in batches to comply with AWS SQS limits
    const batchSize = 10; // SQS allows a maximum of 10 messages per SendMessageBatch request
    const totalMessages = jobBoards.length;
    let batchesSent = 0;

    for (let i = 0; i < totalMessages; i += batchSize) {
      const batchItems = jobBoards.slice(i, i + batchSize);

      const batchNumber = Math.floor(i / batchSize);

      const entries = batchItems.map((jobBoard, index) => ({
        Id: `msg_${batchNumber}_${index}`, // Allowed characters and unique within the batch
        MessageBody: JSON.stringify({
          jobBoard: jobBoard.name,
          board: jobBoard.provider,
        }),
      }));

      const params = {
        Entries: entries,
        QueueUrl: queueUrl,
      };

      // Send the batch to SQS
      await sqs.sendMessageBatch(params).promise();
      batchesSent++;

      // Optional: Log progress every 100 batches
      if (batchesSent % 100 === 0) {
        console.log(`Sent ${batchesSent * batchSize} messages so far...`);
      }
    }

    console.log(`Successfully sent ${totalMessages} messages to SQS.`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Messages sent successfully." }),
    };
  } catch (error) {
    console.error(`Failed to send messages: ${error}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Failed to send messages: ${error}`,
      }),
    };
  }
};

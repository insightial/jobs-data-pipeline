import { SQS } from "aws-sdk";
import { eachDayOfInterval, parseISO, format, addDays } from "date-fns";
import { JobBoard } from "@insightial/job-types";

// Initialize the SQS client
const sqs = new SQS({ apiVersion: "2012-11-05", region: "us-east-1" });

// The URL of the SQS queue
const queueUrl = process.env.SQS_QUEUE_URL || "";

export const handler = async () => {
  // Read environment variables for date range
  const startDateStr = process.env.START_DATE || "2012-01-01"; // Default to January 1st, 2012
  const endDateStr = process.env.END_DATE || format(new Date(), "yyyy-MM-dd"); // Default to today

  // Parse dates from strings
  const startDate = parseISO(startDateStr);
  const endDate = parseISO(endDateStr);

  // Generate the range of dates
  const dateRange = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const resultsPerPage = 10;
  const totalResults = 100;
  const startIndex = 1;

  const sendPromises = dateRange.map((date) => {
    if (format(date, "yyyy-MM-dd") === startDateStr) {
      return;
    }

    const before = format(date, "yyyy-MM-dd");
    const after = format(addDays(date, -1), "yyyy-MM-dd");

    const searchParams: JobBoard.SearchParameters = {
      before,
      after,
      totalResults,
      resultsPerPage,
      startIndex,
    };

    const params = {
      MessageBody: JSON.stringify(searchParams),
      QueueUrl: queueUrl,
    };

    // Send the message to SQS
    return sqs
      .sendMessage(params)
      .promise()
      .then((data) =>
        console.log(
          `Success, message sent for ${before}. Message ID:`,
          data.MessageId
        )
      )
      .catch((error) =>
        console.error(`Error sending message for ${before}`, error)
      );
  });

  // Wait for all messages to be sent
  try {
    await Promise.all(sendPromises);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "All messages sent successfully." }),
    };
  } catch (error) {
    console.error("Error in sending messages", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send some messages." }),
    };
  }
};

if (process.env.IS_LOCAL) {
  console.log("Running in local environment.");
  handler();
}

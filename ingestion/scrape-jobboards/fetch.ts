import { JobBoard } from "@insightial/job-types";
import { getAllResults } from "./google";
import { getSecret } from "@insightial/job-aws/service/secretManager";

export async function fetchJobBoards(
  before: string = "",
  after: string = "",
  totalResults: number = 100,
  resultsPerPage: number = 10,
  startIndex: number = 1
): Promise<JobBoard.JobBoard[] | undefined> {
  let searchTerm: string;
  if (!before || !after) {
    searchTerm = "site:jobs.lever.co OR site:boards.greenhouse.io";
  } else {
    searchTerm = `site:jobs.lever.co OR site:boards.greenhouse.io before:${before} after:${after}`;
  }
  const apiKey = (await getSecret("google_cloud_platform_api_key")) as string;
  const customSearchEngineId = (await getSecret("jobs_cse")) as string;

  if (!apiKey || !customSearchEngineId) {
    console.error("Missing environment variables");
    return [];
  }

  try {
    const results = await getAllResults(
      searchTerm,
      apiKey,
      customSearchEngineId,
      totalResults,
      resultsPerPage,
      startIndex
    );

    return results;
  } catch (error) {
    console.error("Failed to fetch results:", error);
  }
}

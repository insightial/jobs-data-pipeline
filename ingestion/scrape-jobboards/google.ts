/**
 * This script performs Google Custom Search to retrieve job listings
 *
 * Sites:
 * - jobs.lever.co/*
 * - boards.greenhouse.io/*
 *
 * - careers.smartrecruiters.com/*
 * - jobs.jobvite.com/*
 *
 * - wellfound.com/company/*\/jobs
 * - linkedin.com/jobs
 * - glassdoor.com/jobs
 * - indeed.com
 * - monster.com
 * - careerbuilder.com
 * - simplyhired.com
 * - ziprecruiter.com
 * - dice.com
 * - angel.co/jobs
 */

import axios from "axios";
import { JobBoard } from "@insightial/job-types";
import { Agent } from "http";
import { Agent as HttpsAgent } from "https";

const httpAgent = new Agent({ keepAlive: true });
const httpsAgent = new HttpsAgent({ keepAlive: true });

const googleSearch = async (
  searchTerm: string,
  apiKey: string,
  customSearchEngineId: string,
  start: number = 1,
  numResults: number = 10
): Promise<JobBoard.JobBoard[]> => {
  const url = "https://www.googleapis.com/customsearch/v1";
  try {
    const response = await axios.get(url, {
      httpAgent,
      httpsAgent,
      params: {
        q: searchTerm,
        key: apiKey,
        cx: customSearchEngineId,
        start: start,
        num: numResults,
      },
    });
    return response.data.items.map((item: any, index: number) => {
      const extractName = (url: string): string => {
        // Remove trailing slash if present and split the URL by '/'
        const parts = url.replace(/\/$/, "").split("/");
        // Return the last part which should be the company name
        return parts[parts.length - 1];
      };
      const name = extractName(item.link);
      return {
        provider: item.link.includes("lever") ? "lever" : "greenhouse",
        name,
        snippet: item.snippet,
        title: item.title,
        ogUrl: item?.pagemap?.metamaps?.[0]?.ogUrl,
      };
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("HTTP error:", error.message);
      throw error;
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getAllResults = async (
  searchTerm: string,
  apiKey: string,
  customSearchEngineId: string,
  totalResults: number = 10000,
  resultsPerPage: number = 10,
  startIndex: number = 1
): Promise<JobBoard.JobBoard[]> => {
  let results: any[] = [];
  for (
    let startIdx = startIndex;
    startIdx <= totalResults;
    startIdx += resultsPerPage
  ) {
    try {
      const searchResults = await googleSearch(
        searchTerm,
        apiKey,
        customSearchEngineId,
        startIdx,
        resultsPerPage
      );

      results = results.concat(searchResults); // Aggregate results

      if (results.length < resultsPerPage) {
        break;
      }

      if (results.length < resultsPerPage) {
        // Exit loop if fewer results returned than requested (end of available results)
        break;
      }

      // To respect API rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error during search:", error);
      break;
    }
  }
  return results;
};

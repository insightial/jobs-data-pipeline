// src/leverConnector.ts
import axios from "axios";
import prisma from "@insightial/job-prisma-schema";
import { Prisma, WorkplaceType } from "@prisma/client";

function mapWorkplaceType(value: string | null): WorkplaceType | null {
  if (!value) return null;

  switch (value) {
    case "on-site":
      return WorkplaceType.on_site;
    case "remote":
      return WorkplaceType.remote;
    case "hybrid":
      return WorkplaceType.hybrid;
    case "unspecified":
      return WorkplaceType.unspecified;
    default:
      return null; // Handle unexpected values
  }
}

// Function to fetch job postings from Lever API
async function fetchLeverJobs(board: string): Promise<any[]> {
  const url = `https://api.lever.co/v0/postings/${board}?mode=json`;
  const response = await axios.get(url);
  return response.data;
}

// Save the jobs to the Prisma database
async function saveJobsToPrismaLever(jobsData: any[], board: string) {
  try {
    // Prepare data for bulk insertion
    const leverJobsData: Prisma.LeverJobCreateManyInput[] = [];
    const leverListsData: Prisma.LeverJobListCreateManyInput[] = [];

    for (const job of jobsData) {
      // Prepare job data
      leverJobsData.push({
        id: job.id,
        board: board,
        text: job.text,
        team: job.categories.team || null,
        location: job.categories.location || null,
        commitment: job.categories.commitment || null,
        department: job.categories.department || null,
        allLocations: job.categories.allLocations || [],
        country: job.country || null,
        opening: job.opening || null,
        openingPlain: job.openingPlain || null,
        description: job.description || null,
        descriptionPlain: job.descriptionPlain || null,
        descriptionBody: job.descriptionBody || null,
        descriptionBodyPlain: job.descriptionBodyPlain || null,
        additional: job.additional || null,
        additionalPlain: job.additionalPlain || null,
        hostedUrl: job.hostedUrl || null,
        applyUrl: job.applyUrl || null,
        workplaceType: mapWorkplaceType(job.workplaceType),
        salaryDescription: job.salaryDescription || null,
        salaryDescriptionPlain: job.salaryDescriptionPlain || null,
        salaryRangeCurrency: job.salaryRange?.currency || null,
        salaryRangeInterval: job.salaryRange?.interval || null,
        salaryRangeMin: job.salaryRange?.min || null,
        salaryRangeMax: job.salaryRange?.max || null,
      });

      // Prepare lists data
      if (job.lists) {
        for (const listItem of job.lists) {
          leverListsData.push({
            jobId: job.id,
            text: listItem.text,
            content: listItem.content,
          });
        }
      }
    }

    // Bulk insert jobs
    await prisma.leverJob.createMany({
      data: leverJobsData,
      skipDuplicates: true,
    });

    // Bulk insert lists
    if (leverListsData.length > 0) {
      await prisma.leverJobList.createMany({
        data: leverListsData,
        skipDuplicates: true,
      });
    }

    console.log("Successfully saved all Lever jobs");
  } catch (error) {
    console.error("Error saving Lever jobs", error);
    throw error;
  }
}

// Main function to connect the API and save jobs
export async function syncLeverJobs(board: string) {
  try {
    const jobs = await fetchLeverJobs(board);
    await saveJobsToPrismaLever(jobs, board);
    console.log("Lever job sync completed.");
  } catch (error) {
    console.error("Error syncing jobs from Lever API", error);
    throw error;
  }
}

// src/greenhouseConnector.ts
import axios from "axios";
import prisma from "@insightial/job-prisma-schema";
import { Greenhouse } from "@insightial/job-types";
import { Prisma } from "@prisma/client";

// Function to fetch the list of jobs
async function fetchGreenhouseJobs(
  jobBoardToken: string
): Promise<Greenhouse.GreenhouseJobListAPIResponse> {
  const url = `https://boards-api.greenhouse.io/v1/boards/${jobBoardToken}/jobs`;
  const response = await axios.get(url, {
    params: {
      questions: true,
      pay_transparency: true,
    },
  });
  return response.data;
}

// Function to fetch individual job details
async function fetchGreenhouseJobDetails(
  jobBoardToken: string,
  jobId: string
): Promise<Greenhouse.GreenhouseJobAPIResponse> {
  const url = `https://boards-api.greenhouse.io/v1/boards/${jobBoardToken}/jobs/${jobId}`;
  const response = await axios.get(url, {
    params: {
      questions: true,
      pay_transparency: true,
    },
  });
  return response.data;
}

async function getGreenhouseJobId(absoluteUrl: string): Promise<string | null> {
  // Step 1: Check if the URL contains a `gh_jid` query parameter
  const url = new URL(absoluteUrl);
  const gh_jid = url.searchParams.get("gh_jid");

  if (gh_jid) {
    return gh_jid; // Return the job ID from the query parameter
  }

  // Step 2: If `gh_jid` is not present, extract the jobId from the path (e.g., `/jobs/{jobId}`)
  const jobIdMatch = absoluteUrl.match(/\/jobs\/(\d+)/);
  return jobIdMatch ? jobIdMatch[1] : null; // Return the job ID from the URL path
}

// Main function to get all jobs and fetch individual details
async function getGreenhouseJobDetailsForAllJobs(
  jobBoardToken: string
): Promise<Greenhouse.GreenhouseJobAPIResponse[]> {
  // Step 1: Fetch the list of jobs
  const jobListResponse = await fetchGreenhouseJobs(jobBoardToken);

  // Step 2: Initialize an array to store job details
  const detailedJobs: Greenhouse.GreenhouseJobAPIResponse[] = [];

  // Step 3: Loop through each job and extract jobId from the absolute_url
  for (const job of jobListResponse.jobs) {
    // Extract the jobId from either the query parameter (`gh_jid`) or the path (`/jobs/{jobId}`)
    const jobId = await getGreenhouseJobId(job.absolute_url);

    if (jobId) {
      // Step 4: Fetch individual job details using the jobId
      const detailedJob = await fetchGreenhouseJobDetails(jobBoardToken, jobId);
      detailedJobs.push(detailedJob);
    }
  }

  // Step 5: Return the detailed jobs array
  return detailedJobs;
}

// Save the jobs to the Prisma database
async function saveJobsToPrisma(
  response: Greenhouse.GreenhouseJobAPIResponse[],
  board: string
) {
  try {
    // Collect unique locations
    const locationMap = new Map<string, { name: string }>();
    for (const job of response) {
      if (job.location && job.location.name) {
        locationMap.set(job.location.name, { name: job.location.name });
      }
    }
    const locations = Array.from(locationMap.values());

    // Bulk insert locations
    await prisma.greenhouseLocation.createMany({
      data: locations,
      skipDuplicates: true,
    });

    // Fetch all locations to get their IDs
    const allLocations = await prisma.greenhouseLocation.findMany();
    const locationIdMap = new Map<string, number>();
    for (const loc of allLocations) {
      locationIdMap.set(loc.name, loc.id);
    }

    // Collect unique departments
    const departmentMap = new Map<bigint, { id: bigint; name: string }>();
    for (const job of response) {
      for (const dept of job.departments) {
        departmentMap.set(dept.id, {
          id: dept.id,
          name: dept.name,
        });
      }
    }
    const departments = Array.from(departmentMap.values());

    // Bulk insert departments
    await prisma.greenhouseDepartment.createMany({
      data: departments,
      skipDuplicates: true,
    });

    // Collect unique offices
    const officeMap = new Map<
      bigint,
      { id: bigint; name: string; location?: string }
    >();
    for (const job of response) {
      for (const office of job.offices) {
        officeMap.set(office.id, {
          id: office.id,
          name: office.name,
          location: office.location || "",
        });
      }
    }
    const offices = Array.from(officeMap.values());

    // Bulk insert offices
    await prisma.greenhouseOffice.createMany({
      data: offices,
      skipDuplicates: true,
    });

    // Prepare job data
    const jobsData = response.map((job) => ({
      id: job.id,
      title: job.title,
      updated_at: new Date(job.updated_at),
      absolute_url: job.absolute_url,
      internal_job_id: job.internal_job_id,
      locationId: locationIdMap.get(job.location.name),
      metadata: job.metadata || {},
      content: job.content,
      data_compliance: job.data_compliance || {},
      board,
    }));

    // Bulk insert jobs
    await prisma.greenhouseJob.createMany({
      data: jobsData,
      skipDuplicates: true,
    });

    // Collect job-department relations
    const jobDepartmentRelations: { jobId: bigint; departmentId: bigint }[] =
      [];
    for (const job of response) {
      for (const dept of job.departments) {
        jobDepartmentRelations.push({
          jobId: job.id,
          departmentId: dept.id,
        });
      }
    }

    // Bulk insert job-department relations
    await prisma.greenhouseJobDepartment.createMany({
      data: jobDepartmentRelations,
      skipDuplicates: true,
    });

    // Collect job-office relations
    const jobOfficeRelations: { jobId: bigint; officeId: bigint }[] = [];
    for (const job of response) {
      for (const office of job.offices) {
        jobOfficeRelations.push({
          jobId: job.id,
          officeId: office.id,
        });
      }
    }

    // Bulk insert job-office relations
    await prisma.greenhouseJobOffice.createMany({
      data: jobOfficeRelations,
      skipDuplicates: true,
    });

    // Collect questions
    const questionsData: Prisma.GreenhouseQuestionCreateManyInput[] = [];
    for (const job of response) {
      const allQuestions = [
        ...(job.questions || []),
        ...(job.location_questions || []),
      ];
      for (const question of allQuestions) {
        questionsData.push({
          jobId: job.id,
          label: question.label,
          required: question.required,
          fields: question.fields || {},
        });
      }
    }

    // Bulk insert questions
    await prisma.greenhouseQuestion.createMany({
      data: questionsData,
      skipDuplicates: true,
    });

    console.log("Successfully saved all jobs");
  } catch (error) {
    console.error("Error saving jobs", error);
    throw error;
  }
}

// Main function to connect the API and save jobs
export async function syncGreenhouseJobs(jobBoard: string) {
  try {
    const jobs = await getGreenhouseJobDetailsForAllJobs(jobBoard);
    await saveJobsToPrisma(jobs, jobBoard);
    console.log("Job sync completed.");
  } catch (error) {
    console.error("Error syncing jobs from Greenhouse API", error);
    throw error;
  }
}

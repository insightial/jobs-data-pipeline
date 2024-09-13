import {
  GreenhouseJob,
  GreenhouseLocation,
  GreenhouseDepartment,
  GreenhouseQuestion,
  GreenhouseOffice,
} from "@insightial/job-prisma-schema";

export type GreenhouseJobAPIResponse = GreenhouseJob & {
  location: GreenhouseLocation;
  departments: GreenhouseDepartment[];
  offices: GreenhouseOffice[];
  questions: GreenhouseQuestion[];
  location_questions: GreenhouseQuestion[];
};

// Define the full response
export type GreenhouseJobListAPIResponse = {
  jobs: GreenhouseJobAPIResponse[];
};

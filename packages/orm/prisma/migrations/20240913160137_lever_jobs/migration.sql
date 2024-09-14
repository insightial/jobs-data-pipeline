-- CreateEnum
CREATE TYPE "WorkplaceType" AS ENUM ('unspecified', 'on-site', 'remote', 'hybrid');

-- CreateTable
CREATE TABLE "LeverJob" (
    "id" TEXT NOT NULL,
    "board" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "country" TEXT,
    "opening" TEXT,
    "openingPlain" TEXT,
    "description" TEXT,
    "descriptionPlain" TEXT,
    "descriptionBody" TEXT,
    "descriptionBodyPlain" TEXT,
    "additional" TEXT,
    "additionalPlain" TEXT,
    "hostedUrl" TEXT,
    "applyUrl" TEXT,
    "workplaceType" "WorkplaceType",
    "salaryDescription" TEXT,
    "salaryDescriptionPlain" TEXT,
    "location" TEXT,
    "commitment" TEXT,
    "team" TEXT,
    "department" TEXT,
    "allLocations" TEXT[],
    "salaryRangeCurrency" TEXT,
    "salaryRangeInterval" TEXT,
    "salaryRangeMin" DOUBLE PRECISION,
    "salaryRangeMax" DOUBLE PRECISION,

    CONSTRAINT "LeverJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeverJobList" (
    "id" SERIAL NOT NULL,
    "jobId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "LeverJobList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LeverJobList" ADD CONSTRAINT "LeverJobList_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "LeverJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

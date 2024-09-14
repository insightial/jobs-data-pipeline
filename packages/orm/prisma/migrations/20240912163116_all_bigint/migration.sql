/*
  Warnings:

  - The primary key for the `GreenhouseJob` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "GreenhouseQuestion" DROP CONSTRAINT "GreenhouseQuestion_jobId_fkey";

-- DropForeignKey
ALTER TABLE "GreenhouseQuestion" DROP CONSTRAINT "GreenhouseQuestion_locationJob_fkey";

-- DropForeignKey
ALTER TABLE "_DepartmentJobs" DROP CONSTRAINT "_DepartmentJobs_B_fkey";

-- AlterTable
ALTER TABLE "GreenhouseJob" DROP CONSTRAINT "GreenhouseJob_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGINT,
ADD CONSTRAINT "GreenhouseJob_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GreenhousePayRange" ALTER COLUMN "jobId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "GreenhouseQuestion" ALTER COLUMN "jobId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "_DepartmentJobs" ALTER COLUMN "B" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "GreenhouseQuestion" ADD CONSTRAINT "GreenhouseQuestion_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "GreenhouseJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GreenhouseQuestion" ADD CONSTRAINT "GreenhouseQuestion_locationJob_fkey" FOREIGN KEY ("jobId") REFERENCES "GreenhouseJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentJobs" ADD CONSTRAINT "_DepartmentJobs_B_fkey" FOREIGN KEY ("B") REFERENCES "GreenhouseJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

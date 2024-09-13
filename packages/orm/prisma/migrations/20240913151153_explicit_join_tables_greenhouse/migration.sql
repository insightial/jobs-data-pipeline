/*
  Warnings:

  - You are about to drop the `_DepartmentJobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DepartmentOffice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OfficeJobs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DepartmentJobs" DROP CONSTRAINT "_DepartmentJobs_A_fkey";

-- DropForeignKey
ALTER TABLE "_DepartmentJobs" DROP CONSTRAINT "_DepartmentJobs_B_fkey";

-- DropForeignKey
ALTER TABLE "_DepartmentOffice" DROP CONSTRAINT "_DepartmentOffice_A_fkey";

-- DropForeignKey
ALTER TABLE "_DepartmentOffice" DROP CONSTRAINT "_DepartmentOffice_B_fkey";

-- DropForeignKey
ALTER TABLE "_OfficeJobs" DROP CONSTRAINT "_OfficeJobs_A_fkey";

-- DropForeignKey
ALTER TABLE "_OfficeJobs" DROP CONSTRAINT "_OfficeJobs_B_fkey";

-- DropTable
DROP TABLE "_DepartmentJobs";

-- DropTable
DROP TABLE "_DepartmentOffice";

-- DropTable
DROP TABLE "_OfficeJobs";

-- CreateTable
CREATE TABLE "GreenhouseJobDepartment" (
    "jobId" BIGINT NOT NULL,
    "departmentId" BIGINT NOT NULL,

    CONSTRAINT "GreenhouseJobDepartment_pkey" PRIMARY KEY ("jobId","departmentId")
);

-- CreateTable
CREATE TABLE "GreenhouseJobOffice" (
    "jobId" BIGINT NOT NULL,
    "officeId" BIGINT NOT NULL,

    CONSTRAINT "GreenhouseJobOffice_pkey" PRIMARY KEY ("jobId","officeId")
);

-- CreateTable
CREATE TABLE "GreenhouseDepartmentOffice" (
    "departmentId" BIGINT NOT NULL,
    "officeId" BIGINT NOT NULL,

    CONSTRAINT "GreenhouseDepartmentOffice_pkey" PRIMARY KEY ("departmentId","officeId")
);

-- AddForeignKey
ALTER TABLE "GreenhouseJobDepartment" ADD CONSTRAINT "GreenhouseJobDepartment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "GreenhouseJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GreenhouseJobDepartment" ADD CONSTRAINT "GreenhouseJobDepartment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "GreenhouseDepartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GreenhouseJobOffice" ADD CONSTRAINT "GreenhouseJobOffice_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "GreenhouseJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GreenhouseJobOffice" ADD CONSTRAINT "GreenhouseJobOffice_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "GreenhouseOffice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GreenhouseDepartmentOffice" ADD CONSTRAINT "GreenhouseDepartmentOffice_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "GreenhouseDepartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GreenhouseDepartmentOffice" ADD CONSTRAINT "GreenhouseDepartmentOffice_officeId_fkey" FOREIGN KEY ("officeId") REFERENCES "GreenhouseOffice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

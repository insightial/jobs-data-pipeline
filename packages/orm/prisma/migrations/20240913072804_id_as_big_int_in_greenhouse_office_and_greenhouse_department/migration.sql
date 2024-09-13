/*
  Warnings:

  - The primary key for the `GreenhouseDepartment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `GreenhouseOffice` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "GreenhouseDepartment" DROP CONSTRAINT "GreenhouseDepartment_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "GreenhouseOffice" DROP CONSTRAINT "GreenhouseOffice_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "_DepartmentJobs" DROP CONSTRAINT "_DepartmentJobs_A_fkey";

-- DropForeignKey
ALTER TABLE "_DepartmentOffice" DROP CONSTRAINT "_DepartmentOffice_A_fkey";

-- DropForeignKey
ALTER TABLE "_DepartmentOffice" DROP CONSTRAINT "_DepartmentOffice_B_fkey";

-- DropForeignKey
ALTER TABLE "_OfficeJobs" DROP CONSTRAINT "_OfficeJobs_B_fkey";

-- AlterTable
ALTER TABLE "GreenhouseDepartment" DROP CONSTRAINT "GreenhouseDepartment_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGINT,
ALTER COLUMN "parent_id" SET DATA TYPE BIGINT,
ADD CONSTRAINT "GreenhouseDepartment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GreenhouseOffice" DROP CONSTRAINT "GreenhouseOffice_pkey",
ALTER COLUMN "id" SET DATA TYPE BIGINT,
ALTER COLUMN "parent_id" SET DATA TYPE BIGINT,
ADD CONSTRAINT "GreenhouseOffice_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_DepartmentJobs" ALTER COLUMN "A" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "_DepartmentOffice" ALTER COLUMN "A" SET DATA TYPE BIGINT,
ALTER COLUMN "B" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "_OfficeJobs" ALTER COLUMN "B" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "GreenhouseOffice" ADD CONSTRAINT "GreenhouseOffice_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "GreenhouseOffice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GreenhouseDepartment" ADD CONSTRAINT "GreenhouseDepartment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "GreenhouseDepartment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentOffice" ADD CONSTRAINT "_DepartmentOffice_A_fkey" FOREIGN KEY ("A") REFERENCES "GreenhouseDepartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentOffice" ADD CONSTRAINT "_DepartmentOffice_B_fkey" FOREIGN KEY ("B") REFERENCES "GreenhouseOffice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentJobs" ADD CONSTRAINT "_DepartmentJobs_A_fkey" FOREIGN KEY ("A") REFERENCES "GreenhouseDepartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfficeJobs" ADD CONSTRAINT "_OfficeJobs_B_fkey" FOREIGN KEY ("B") REFERENCES "GreenhouseOffice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

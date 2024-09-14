/*
  Warnings:

  - Added the required column `board` to the `GreenhouseJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `GreenhouseJob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GreenhouseJob" ADD COLUMN     "board" TEXT NOT NULL,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "data_compliance" JSONB;

-- CreateTable
CREATE TABLE "_OfficeJobs" (
    "A" BIGINT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OfficeJobs_AB_unique" ON "_OfficeJobs"("A", "B");

-- CreateIndex
CREATE INDEX "_OfficeJobs_B_index" ON "_OfficeJobs"("B");

-- AddForeignKey
ALTER TABLE "_OfficeJobs" ADD CONSTRAINT "_OfficeJobs_A_fkey" FOREIGN KEY ("A") REFERENCES "GreenhouseJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfficeJobs" ADD CONSTRAINT "_OfficeJobs_B_fkey" FOREIGN KEY ("B") REFERENCES "GreenhouseOffice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

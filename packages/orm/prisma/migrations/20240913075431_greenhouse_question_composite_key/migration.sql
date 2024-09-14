/*
  Warnings:

  - The primary key for the `GreenhouseQuestion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `GreenhouseQuestion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jobId,label]` on the table `GreenhouseQuestion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "GreenhouseQuestion" DROP CONSTRAINT "GreenhouseQuestion_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "GreenhouseQuestion_jobId_label_key" ON "GreenhouseQuestion"("jobId", "label");

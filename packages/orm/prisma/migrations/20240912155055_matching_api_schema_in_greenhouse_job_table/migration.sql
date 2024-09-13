/*
  Warnings:

  - You are about to drop the column `absoluteUrl` on the `GreenhouseJob` table. All the data in the column will be lost.
  - You are about to drop the column `greenhousePayRangeId` on the `GreenhouseJob` table. All the data in the column will be lost.
  - You are about to drop the column `internalJobId` on the `GreenhouseJob` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `GreenhouseJob` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pay_input_range_id]` on the table `GreenhouseJob` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `absolute_url` to the `GreenhouseJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `GreenhouseJob` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GreenhouseJob" DROP CONSTRAINT "GreenhouseJob_greenhousePayRangeId_fkey";

-- DropIndex
DROP INDEX "GreenhouseJob_greenhousePayRangeId_key";

-- AlterTable
ALTER TABLE "GreenhouseJob" DROP COLUMN "absoluteUrl",
DROP COLUMN "greenhousePayRangeId",
DROP COLUMN "internalJobId",
DROP COLUMN "updatedAt",
ADD COLUMN     "absolute_url" TEXT NOT NULL,
ADD COLUMN     "internal_job_id" INTEGER,
ADD COLUMN     "pay_input_range_id" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "GreenhouseJob_pay_input_range_id_key" ON "GreenhouseJob"("pay_input_range_id");

-- AddForeignKey
ALTER TABLE "GreenhouseJob" ADD CONSTRAINT "GreenhouseJob_pay_input_range_id_fkey" FOREIGN KEY ("pay_input_range_id") REFERENCES "GreenhousePayRange"("id") ON DELETE SET NULL ON UPDATE CASCADE;

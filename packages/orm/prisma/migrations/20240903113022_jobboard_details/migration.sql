/*
  Warnings:

  - Added the required column `ogUrl` to the `JobBoard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `snippet` to the `JobBoard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `JobBoard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobBoard" ADD COLUMN     "ogUrl" TEXT NOT NULL,
ADD COLUMN     "snippet" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "JobBoard" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "JobBoard_pkey" PRIMARY KEY ("id")
);

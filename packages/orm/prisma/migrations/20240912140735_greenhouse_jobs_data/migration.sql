-- CreateTable
CREATE TABLE "GreenhouseOffice" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" INTEGER,

    CONSTRAINT "GreenhouseOffice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GreenhouseDepartment" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" INTEGER,

    CONSTRAINT "GreenhouseDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GreenhouseJob" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "absoluteUrl" TEXT NOT NULL,
    "internalJobId" INTEGER,
    "locationId" INTEGER,
    "greenhousePayRangeId" INTEGER,
    "metadata" JSONB,

    CONSTRAINT "GreenhouseJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GreenhouseLocation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GreenhouseLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GreenhousePayRange" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER,
    "min_cents" DOUBLE PRECISION NOT NULL,
    "max_cents" DOUBLE PRECISION NOT NULL,
    "currency_code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "blurb" TEXT NOT NULL,

    CONSTRAINT "GreenhousePayRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GreenhouseQuestion" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL,
    "fields" JSONB NOT NULL,

    CONSTRAINT "GreenhouseQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DepartmentOffice" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_DepartmentJobs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GreenhouseJob_locationId_key" ON "GreenhouseJob"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "GreenhouseJob_greenhousePayRangeId_key" ON "GreenhouseJob"("greenhousePayRangeId");

-- CreateIndex
CREATE UNIQUE INDEX "GreenhousePayRange_jobId_key" ON "GreenhousePayRange"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "_DepartmentOffice_AB_unique" ON "_DepartmentOffice"("A", "B");

-- CreateIndex
CREATE INDEX "_DepartmentOffice_B_index" ON "_DepartmentOffice"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DepartmentJobs_AB_unique" ON "_DepartmentJobs"("A", "B");

-- CreateIndex
CREATE INDEX "_DepartmentJobs_B_index" ON "_DepartmentJobs"("B");

-- AddForeignKey
ALTER TABLE "GreenhouseOffice" ADD CONSTRAINT "GreenhouseOffice_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "GreenhouseOffice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GreenhouseDepartment" ADD CONSTRAINT "GreenhouseDepartment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "GreenhouseDepartment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GreenhouseJob" ADD CONSTRAINT "GreenhouseJob_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "GreenhouseLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GreenhouseJob" ADD CONSTRAINT "GreenhouseJob_greenhousePayRangeId_fkey" FOREIGN KEY ("greenhousePayRangeId") REFERENCES "GreenhousePayRange"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GreenhouseQuestion" ADD CONSTRAINT "GreenhouseQuestion_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "GreenhouseJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GreenhouseQuestion" ADD CONSTRAINT "GreenhouseQuestion_locationJob_fkey" FOREIGN KEY ("jobId") REFERENCES "GreenhouseJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentOffice" ADD CONSTRAINT "_DepartmentOffice_A_fkey" FOREIGN KEY ("A") REFERENCES "GreenhouseDepartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentOffice" ADD CONSTRAINT "_DepartmentOffice_B_fkey" FOREIGN KEY ("B") REFERENCES "GreenhouseOffice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentJobs" ADD CONSTRAINT "_DepartmentJobs_A_fkey" FOREIGN KEY ("A") REFERENCES "GreenhouseDepartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DepartmentJobs" ADD CONSTRAINT "_DepartmentJobs_B_fkey" FOREIGN KEY ("B") REFERENCES "GreenhouseJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

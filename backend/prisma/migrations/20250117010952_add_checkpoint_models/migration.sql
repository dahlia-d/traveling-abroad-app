-- CreateTable
CREATE TABLE "Checkpoint" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "fromCountryId" INTEGER NOT NULL,
    "toCountryId" INTEGER NOT NULL,
    "latitudeFrom" DECIMAL(65,30) NOT NULL,
    "longitudeFrom" DECIMAL(65,30) NOT NULL,
    "latitudeTo" DECIMAL(65,30) NOT NULL,
    "longitudeTo" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Checkpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckpointTrafficData" (
    "id" SERIAL NOT NULL,
    "checkpointId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "durationInTraffic" INTEGER NOT NULL,

    CONSTRAINT "CheckpointTrafficData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Checkpoint_name_key" ON "Checkpoint"("name");

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_fromCountryId_fkey" FOREIGN KEY ("fromCountryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkpoint" ADD CONSTRAINT "Checkpoint_toCountryId_fkey" FOREIGN KEY ("toCountryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckpointTrafficData" ADD CONSTRAINT "CheckpointTrafficData_checkpointId_fkey" FOREIGN KEY ("checkpointId") REFERENCES "Checkpoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

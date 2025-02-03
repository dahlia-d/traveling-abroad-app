-- DropForeignKey
ALTER TABLE "CheckpointTrafficData" DROP CONSTRAINT "CheckpointTrafficData_checkpointId_fkey";

-- AddForeignKey
ALTER TABLE "CheckpointTrafficData" ADD CONSTRAINT "CheckpointTrafficData_checkpointId_fkey" FOREIGN KEY ("checkpointId") REFERENCES "Checkpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

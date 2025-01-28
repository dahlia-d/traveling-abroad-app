import { fetchTrafficData, getCheckpointTrafficData, getCheckpoits, fetchCheckpointCoordinates } from "../../controllers/checkpointsController";
import { publicProcedure, router } from "../trpc";
import { z } from 'zod';


export const checkpointsRouter = router({
    getCheckpointTrafficData: publicProcedure
        .input(
            z.object({
                checkpointId: z.number(),
                fromDate: z.string(),
                toDate: z.string()
            })
        )
        .query(async ({ input }) => {
            console.log(new Date(input.fromDate), new Date(input.toDate))
            console.log("getCheckpointTrafficData route")
            return await getCheckpointTrafficData(input.checkpointId, new Date(input.fromDate), new Date(input.toDate));
        }),
    getCheckpoits: publicProcedure
        .query(async () => {
            console.log("checkpints route");
            return await getCheckpoits();
        }),
    getCheckpointRealTimeTraffic: publicProcedure
        .input(
            z.object({
                checkpointId: z.number()
            })
        )
        .mutation(async ({ input }) => {
            const coordinates = await fetchCheckpointCoordinates(input.checkpointId);
            if (coordinates) {
                return await fetchTrafficData(coordinates, new Date());
            }
            return null;
        })
})
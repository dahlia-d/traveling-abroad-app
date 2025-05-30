import { fetchTrafficData, getCheckpointTrafficData, getCheckpoints, fetchCheckpointCoordinates } from "../../controllers/checkpointsController";
import { publicProcedure, router } from "../trpc";
import { z } from 'zod';


export const checkpointsRouter = router({
    getCheckpointTrafficData: publicProcedure
        .input(
            z.object({
                checkpointId: z.number(),
                fromDate: z.date(),
                toDate: z.date(),
            })
        )
        .query(async ({ input }) => {
            return await getCheckpointTrafficData(input.checkpointId, new Date(input.fromDate), new Date(input.toDate));
        }),
    getCheckpoints: publicProcedure
        .query(async () => {
            return await getCheckpoints();
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
            return null;//error
        })
})
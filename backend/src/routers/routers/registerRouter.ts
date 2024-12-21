import { router, publicProcedure } from "../trpc";
import z from 'zod';
import { registerUser } from "../../controllers/registerController";

export const registerRouter = router({
    register: publicProcedure
        .input(
            z.object({
                username: z.string(),
                password: z.string()
            })
        )
        .mutation( async ({input}) => {
            registerUser(input.username, input.password);
        }),
});

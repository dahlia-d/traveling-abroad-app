import type { AppRouter } from "../../backend/src/routers";

import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();

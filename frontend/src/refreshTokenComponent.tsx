import { trpc } from "./api";
import { useEffect } from 'react';

export const RefreshToken = () => {
    const refreshToken = trpc.authenticate.refresh.useMutation();

    useEffect(() => {
        const intervalId = setInterval(() => {
            refreshToken.mutate();
            console.log('Timeout');
        }, 2 * 60 * 60 * 1000)

        return () => clearInterval(intervalId);
    }, [refreshToken]);

    return null;
}
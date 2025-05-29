import Select from "react-select";
import { trpc } from "@/api";
import { useState } from "react";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";

export const CheckpointsRealTime = () => {
    const [realTimeTraffic, setRealTimeTraffic] = useState<number | null>(null);

    const checkpoints = trpc.checkpoints.getCheckpoints.useQuery();

    const checkpointsOptions = checkpoints.data?.map((checkpoint) => {
        return {
            value: { id: checkpoint.id, name: checkpoint.name },
            label: `${checkpoint.name} (${checkpoint.fromCountry} -> ${checkpoint.toCountry})`,
        };
    });
    const realTimeTrafficMutation =
        trpc.checkpoints.getCheckpointRealTimeTraffic.useMutation();

    const handleSelect = (id: number) => {
        realTimeTrafficMutation.mutate(
            { checkpointId: id },
            {
                onSuccess: (data) => {
                    if (data) {
                        setRealTimeTraffic(data);
                    }
                },
                onError: (error) => {
                    console.error(error);
                },
            },
        );
    };

    if (checkpoints.isError || realTimeTrafficMutation.isError) {
        return <Error />;
    }

    if (checkpoints.isLoading) {
        return <Loading />;
    }

    return (
        <div className="flex w-96 flex-col items-center gap-3 rounded-sm border-2 border-black bg-white p-10 drop-shadow">
            <Select
                className="min-w-60"
                classNamePrefix="select"
                options={checkpointsOptions}
                onChange={(value) => {
                    if (value?.value.id) {
                        handleSelect(value?.value.id);
                    }
                }}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary25: "hsl(var(--secondary))",
                        primary: "black",
                    },
                })}
            />
            {realTimeTrafficMutation.isPending ? (
                <Loading />
            ) : realTimeTraffic ? (
                <div className="text-2xl">
                    Waiting time: {Math.round(realTimeTraffic / 60)} min
                </div>
            ) : (
                <h2 className="text-2xl">Select checkpoint</h2>
            )}
        </div>
    );
};

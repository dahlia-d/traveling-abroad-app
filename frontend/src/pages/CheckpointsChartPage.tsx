import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "./../components/ui/chart";
import { trpc } from "@/api";
import Select from "react-select";
import { skipToken } from "@tanstack/react-query";
import moment from "moment";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";

const chartConfig = {
    durationInTraffic: {
        label: "Duration in traffic:\xa0",
        color: "hsl(var(--chart-1))",
    },
    timestamp: {
        label: "Timestamp",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export const Chart = () => {
    const {
        data: checkpoints,
        isError,
        isPending,
    } = trpc.checkpoints.getCheckpoits.useQuery();
    const checkpointsOptions = checkpoints?.map((checkpoint) => {
        return {
            value: { id: checkpoint.id, name: checkpoint.name },
            label: checkpoint.name,
        };
    });
    const [fromDate, setFromDate] = useState<Date | undefined>(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
    });
    const [toDate, setToDate] = useState<Date | undefined>(new Date());

    const [checkpoint, setCheckpoint] = useState<{
        id: number;
        name: string;
    } | null>(null);

    useEffect(() => {
        if (checkpoints && checkpoint == null) {
            setCheckpoint(checkpoints[0]);
        }
    }, [checkpoints]);

    const chartData = trpc.checkpoints.getCheckpointTrafficData.useQuery(
        checkpoint && fromDate && toDate
            ? {
                  checkpointId: checkpoint.id,
                  fromDate: fromDate.toDateString(),
                  toDate: toDate.toDateString(),
              }
            : skipToken,
    ).data;
    const mapedChartData = chartData?.map((value) => {
        const date = moment(value.timestamp).valueOf();
        const durationInTrafficMinutes = Math.round(
            value.durationInTraffic / 60,
        );
        return { timestamp: date, durationInTraffic: durationInTrafficMinutes };
    });

    if (!checkpointsOptions || !mapedChartData || isPending) {
        return <Loading />;
    }

    if (isError) {
        return <Error />;
    }

    return (
        <div className="flex h-[80vh] w-full flex-col gap-3 pr-3">
            <div className="flex flex-row justify-end gap-3">
                <Select
                    classNamePrefix="select"
                    placeholder={checkpointsOptions[0].label}
                    defaultValue={checkpointsOptions[0]}
                    options={checkpointsOptions}
                    onChange={(value) => {
                        if (value?.value) {
                            setCheckpoint(value?.value);
                        }
                    }}
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary25: "hsl(240 4.8% 95.9%)",
                            primary: "black",
                        },
                    })}
                ></Select>
                <Popover modal={true}>
                    <PopoverTrigger asChild>
                        <Button>
                            {fromDate ? (
                                moment(fromDate).format("DD/MM/YYYY")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="">
                        <Calendar
                            mode="single"
                            selected={fromDate}
                            onSelect={setFromDate}
                            className="rounded-md border"
                            today={new Date()}
                            defaultMonth={new Date()}
                        />
                    </PopoverContent>
                </Popover>
                <Popover modal={true}>
                    <PopoverTrigger asChild>
                        <Button>
                            {toDate ? (
                                moment(toDate).format("DD/MM/YYYY")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Calendar
                            mode="single"
                            selected={toDate}
                            onSelect={setToDate}
                            className="rounded-md border"
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <ChartContainer
                config={chartConfig}
                className="min-h-6 w-full flex-grow"
            >
                <LineChart data={mapedChartData ? mapedChartData : []}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        type="number"
                        dataKey="timestamp"
                        tickLine={true}
                        tickMargin={5}
                        axisLine={true}
                        minTickGap={12}
                        domain={["dataMin", "dataMax"]}
                        tickFormatter={(value) => {
                            return moment(value).format("DD/MM/YY HH:mm");
                        }}
                    />
                    <YAxis />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                labelFormatter={(label, [{ payload }]) =>
                                    moment(payload.timestamp).format(
                                        "DD/MM/YY HH:mm",
                                    )
                                }
                            />
                        }
                    />
                    <Line
                        dataKey="durationInTraffic"
                        stroke="hsl(var(--chart-5))"
                        dot={false}
                    ></Line>
                </LineChart>
            </ChartContainer>
        </div>
    );
};

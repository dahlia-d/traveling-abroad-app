import axios from "axios";
import { DistanceMatrixResponse } from "../types";
import prisma from '../prisma/client';
import { Decimal } from "@prisma/client/runtime/library";

export const fetchCheckpointCoordinates = async (checkpointId: number) => {
    const checkpoint = await prisma.checkpoint.findUnique({
        where: {
            id: checkpointId,
        }
    });

    if (checkpoint) {
        const coordinates = [checkpoint.latitudeFrom, checkpoint.longitudeFrom, checkpoint.latitudeTo, checkpoint.longitudeTo];
        return coordinates;
    }

    return null;
}

export const fetchTrafficData = async ([latitudeFrom, longitudeFrom, latitudeTo, longitudeTo]: Decimal[], departureTime: Date) => {
    const departureTimeSeconds = Math.round(departureTime.getTime() / 1000);

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?departure_time=${departureTimeSeconds}&destinations=${latitudeTo}%2C${longitudeTo}&origins=${latitudeFrom}%2C${longitudeFrom}&units=imperial&key=${process.env.API_KEY}`;

    const response = await axios.get(url);
    const result: DistanceMatrixResponse = response.data;

    return result.rows[0].elements[0].duration_in_traffic.value;
}

export const gatherTrafficDataForAllCheckpoints = async () => {
    const checkpoints = await prisma.checkpoint.findMany();

    for (let i = 0; i < checkpoints.length; i++) {
        let coordinates = await fetchCheckpointCoordinates(checkpoints[i].id);
        if (coordinates) {
            let durationInTraffic = await fetchTrafficData(coordinates, new Date());
            const data = await prisma.checkpointTrafficData.create({
                data: {
                    checkpointId: checkpoints[i].id,
                    timestamp: new Date(),
                    durationInTraffic: durationInTraffic
                }
            });
        }
    }
}

export const getCheckpointTrafficData = async (id: number, fromDate: Date, toDate: Date) => {
    const trafficData = await prisma.checkpointTrafficData.findMany({
        where: {
            checkpointId: id,
            timestamp: {
                gte: fromDate,
                lte: toDate
            }
        }
    });

    return trafficData;
}

export const getCheckpoints = async () => {
    const checkpoints = await prisma.checkpoint.findMany();
    const checkpointsResult: { id: number, name: string, fromCountry: string | undefined, toCountry: string | undefined }[] = [];
    for (let i = 0; i < checkpoints.length; i++) {
        checkpointsResult[i] = {
            id: checkpoints[i].id,
            name: checkpoints[i].name, 
            fromCountry: (await prisma.country.findUnique({
                where: {
                    id: checkpoints[i].fromCountryId
                }
            }))?.name, 
            toCountry: (await prisma.country.findUnique({
                where: {
                    id: checkpoints[i].toCountryId
                }
            }))?.name
        }
    }
    return checkpointsResult;
}
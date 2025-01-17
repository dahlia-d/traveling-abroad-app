import axios from "axios";
import { DistanceMatrixResponse } from "../types";
import prisma from '../prisma/client';
import { Decimal } from "@prisma/client/runtime/library";

const fetchCheckpointCoordinates = async (name: string) => {

    const checkpoint = await prisma.checkpoint.findUnique({
        where: {
            name: name,
        }
    });

    if (checkpoint) {
        const coordinates = [checkpoint.latitudeFrom, checkpoint.longitudeFrom, checkpoint.longitudeTo, checkpoint.latitudeTo];
        return coordinates;
    }

    return null;
}

export const fetchTrafficData = async ([latitudeFrom, longitudeFrom, latitudeTo, longitudeTo]: Decimal[], departureTime: Date): Promise<number> => {
    const departureTimeSeconds = Math.round(departureTime.getTime() / 1000);

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?departure_time=${departureTimeSeconds}&destinations=${latitudeTo}%2C${longitudeTo}&origins=${latitudeFrom}%2C${longitudeFrom}&units=imperial&key=${process.env.API_KEY}`;

    console.log(url);

    const responce = await axios.get(url);
    const result: DistanceMatrixResponse = responce.data;

    console.log(responce.data);
    console.log(result.rows[0].elements[0].durationInTraffic);

    return result.rows[0].elements[0].durationInTraffic.value;
}

export const gatherTrafficDataForAllCheckpoints = async () => {
    const checkpoints = await prisma.checkpoint.findMany();

    for (let i = 0; i < checkpoints.length; i++) {
        let coordiates = await fetchCheckpointCoordinates(checkpoints[i].name);
        if (coordiates) {
            let durationInTraffic = await fetchTrafficData(coordiates, new Date());
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
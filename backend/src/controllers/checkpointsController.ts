import axios from "axios";
import { DistanceMatrixResponse } from "../types";

export const gatherTrafficData = async (latitude_from: number, longitude_from: number, latitude_to: number, longitude_to: number, dateTime: Date) => {
    const departureTime = Math.round(dateTime.getTime() / 1000);

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?departure_time=${departureTime}&destinations=${latitude_to}%2C${longitude_to}&origins=${latitude_from}%2C${longitude_from}&units=imperial&key=${process.env.API_KEY}`;

    console.log(url);

    const responce = await axios.get(url);
    const result: DistanceMatrixResponse = responce.data;

    console.log(responce.data);
    console.log(result.rows[0].elements[0].duration_in_traffic);

    return result.rows[0].elements[0].duration_in_traffic.value;
}
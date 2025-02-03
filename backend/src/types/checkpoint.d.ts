import { Decimal } from "@prisma/client/runtime/library";

export interface DistanceMatrixResponse {
    destinationAdresses: string[];
    originAddresses: string[];
    rows: {
        elements: {
            distance: { text: string; value: number };
            duration: { text: string; value: number };
            duration_in_traffic: { text: string; value: number };
            status: string;
        }[];
    }[];
    status: string;
}

export type Coordinates = {
    latitudeFrom: Decimal,
    longitudeFrom: Decimal,
    latitudeTo: Decimal,
    longitudeTo: Decimal
}
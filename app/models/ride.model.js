export class rideModel {

    ASAP: boolean;
    carId: string;
    customerId: string;
    dateTime: Date;
    driverId: string;
    dropof: string;
    fare: number;
    luggageItems: number;
    passengers: number;
    pickup: string;
    return: boolean;
    returnDate: Date;
    rideDriverStatus: number;
    rideStatus: number;
    via: boolean;
    viaLocations: [viaLocationSchema]
}

class viaLocationSchema {
    location: string
}
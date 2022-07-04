import { LocationAccuracy, LocationHeadingCallback } from "expo-location";
import { Memory, Location, Upload, User } from "./models";

type ListResponse<T> = {
    list: T[],
    total: number,
}

export type NearMemories = ListResponse<[Memory, Location, Upload[], number]>;


export type NearLocation = Array<[Location, User, Upload[], number]>;
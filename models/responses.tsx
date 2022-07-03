import { LocationAccuracy } from "expo-location";
import { Memory, Location, Upload } from "./models";

type ListResponse<T> = {
    list: T[],
    total: number,
}

export type NearMemories = ListResponse<[Memory, Location, Upload[], number]>;
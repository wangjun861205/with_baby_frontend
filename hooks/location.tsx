import { useEffect, useState } from "react";
import { getLocation } from "../utils/location";
import { LocationObjectCoords } from "expo-location";

export const useCoords = () => {
    const [loc, setLoc] = useState<LocationObjectCoords>();
    useEffect(() => {
        getLocation().then(v => setLoc(v.coords)).catch(e => console.error(e));
    }, [])
    return loc
}


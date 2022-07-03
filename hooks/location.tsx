import { useEffect, useState } from "react";
import { getLocation } from "../utils/location";
import { LocationObjectCoords } from "expo-location";
import { getItemAsync } from "expo-secure-store";

export const useCoords = () => {
    const [loc, setLoc] = useState<LocationObjectCoords>();
    const [retry, setRetry] = useState(0);
    useEffect(() => {
        getItemAsync("COORDS", ).then(v => {
            if (!v) {
                setTimeout(() => {
                    setRetry(old => old + 1);
                }, 2000);
                return
            }
            setLoc(JSON.parse(v));
        })
    }, [retry])
    return loc
}


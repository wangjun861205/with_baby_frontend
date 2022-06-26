import { useState } from "react";
import { getLocation } from "../utils/location";
import { LocationObjectCoords } from "expo-location";

export const useLocation = () => {
    const [loc, setLoc] = useState<LocationObjectCoords>();
    getLocation().then(v => setLoc(v.coords)).catch(e => console.error(e));
    return loc
}


import { getLocation } from "../utils/location";
import { getJWTToken } from "../utils/jwt";
import { BASE_URL } from "@env";

export const nearbyLocation = async (limit: number, offset: number) => {
    const loc = await getLocation();
    const token = await getJWTToken();
    const params = new URLSearchParams();
    params.append("latitude", loc.coords.latitude.toString());
    params.append("longitude", loc.coords.longitude.toString());
    params.append("limit", limit.toString());
    params.append("offset", offset.toString());
    const res = await fetch(BASE_URL + "/api/locations?" + params);
    if (res.status !== 200) {
        return Promise.reject(res.status);
    }
    return Promise.resolve(res.json())
}
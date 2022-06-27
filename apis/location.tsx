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
    const res = await fetch(BASE_URL + "/api/locations?" + params, {
        headers: {
            JWT_TOKEN: token
        }
    });
    if (res.status !== 200) {
        return Promise.reject(res.status);
    }
    return Promise.resolve(res.json())
}

export const detail = async (id: number) => {
    const token = await getJWTToken();
    const loc = await getLocation();
    const params = new URLSearchParams();
    params.append("latitude", loc.coords.latitude.toString());
    params.append("longitude", loc.coords.longitude.toString());
    return (await fetch(BASE_URL + `/api/locations/${id}?${params}`, { headers: { JWT_TOKEN: token } })).json();

}

type Update = {
    name: string,
    category: number,
    description: string,
    images: number[],
}

export const update = async (id: number, upd: Update) => {
    const token = await getJWTToken();
    const res = await fetch(BASE_URL + `/api/locations/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            JWT_TOKEN: token,
        },
        body: JSON.stringify(upd),
    });
    return res.json();
}
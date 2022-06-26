import { kMaxLength } from "buffer";
import { getJWTToken } from "../utils/jwt"
import { BASE_URL } from "@env";

type ListParams = {
    limit: number,
    offset: number,
}

export const list = async (location: number, params: ListParams) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        p.append(k, `${v}`);
    }
    const token = await getJWTToken();
    const res = await fetch(BASE_URL + `/api/locations/${location}/memories?${p}`, {
        headers: {
            JWT_TOKEN: token,
        }
    });
    if (res.status !== 200) {
        return Promise.reject(new Error(`failed to get memories of location(status: ${res.status})`))
    }
    return res.json();
} 
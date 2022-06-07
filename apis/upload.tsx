import { BASE_URL } from "@env";
import { getJWTToken } from "../utils/jwt";

export const upload = async (list: string[] | Blob[]) => {
    const data = new FormData();
    for (var item of list) {
        data.append("file", item);
    }
    const token = await getJWTToken();
    const res = await fetch(BASE_URL + "/upload", {
        method: "POST",
        headers: {
            JWT_TOKEN: token,
        },
        body: data,
    });
    if (res.status !== 200) {
        return Promise.reject(res.status);
    }
    return await res.json()
}
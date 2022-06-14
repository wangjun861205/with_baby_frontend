import { BASE_URL } from "@env";
import { getJWTToken } from "../utils/jwt";

export const upload = async (content: string | Blob): Promise<number[]> => {
    const data = new FormData();
    data.append("file", content);
    const token = await getJWTToken();
    const res = await fetch(BASE_URL + "/api/upload", {
        method: "post",
        headers: {
            JWT_TOKEN: token,
        },
        body: data,
    });
    if (res.status !== 200) {
        return Promise.reject(res.status);
    }
    return res.json()
}
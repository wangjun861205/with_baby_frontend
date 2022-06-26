import { BASE_URL } from "@env";
import { getJWTToken } from "../utils/jwt";
import * as FS from "expo-file-system";
import { Buffer } from "buffer";


interface File {
    name: string,
    size: number,
    uri: string,
    type: string,
}

export const upload = async (uri: string, headers?: {[key: string]: string}): Promise<number> => {
    const data = new FormData();
    data.append("file", {uri, name: "temp", type: "image/png"} as any);
    const res = await fetch(BASE_URL + "/api/upload", {
        method: "POST",
        headers: headers,
        body: data,
    });
    return Promise.resolve((await res.json())[0]);
}

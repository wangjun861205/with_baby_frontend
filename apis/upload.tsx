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

export const upload = async (uri: string, token: string): Promise<number> => {
    const content = await FS.readAsStringAsync(uri, { encoding: FS.EncodingType.Base64 });
    const buffer = Buffer.from(content, 'base64');
    const blob = new Blob([buffer]);
    const data = new FormData();
    data.append("file", content);
    const res = await fetch(BASE_URL + "/api/upload", {
        method: "post",
        headers: {
            JWT_TOKEN: token,
        },
        body: data,
    });
    if (res.status !== 200) {
        console.error(res);
        return Promise.reject(res.status);
    }
    return Promise.resolve((await res.json())[0]);
}
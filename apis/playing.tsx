import { Playing } from "./models";
import { BASE_URL } from "@env";


export interface NearbyPlayingsParams {
    page: number,
    size: number,
    latitude: number,
    longitude: number,
    token: string,
}

export const nearbyPlayings = async ({ page, size, latitude, longitude, token }: NearbyPlayingsParams): Promise<{ list: Playing[], total: number }> => {
    try {
        const res = await fetch(BASE_URL + `/api/playings?page=${page}&size=${size}&latitude=${latitude}&longitude=${longitude}`,
            {
                method: "get",
                headers: {
                    "JWT_TOKEN": token,
                },
            });
        return res.json()
    } catch (e) {
        return Promise.reject(e)
    }


}
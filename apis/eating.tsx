import { getLocation } from "../utils/location"
import { getJWTToken } from "../utils/jwt"
import { BASE_URL } from "@env";

export const createEating = async (name: string, images: number[]) => {
	const token = await getJWTToken();
	const loc = await getLocation();
	const res = await fetch(BASE_URL + "/api/eatings", {
		method: "post",
		headers: {
			"Content-Type": "application/json",
			"JWT_TOKEN": token,
		},
		body: JSON.stringify({
			name: name,
			latitude: loc.coords.latitude,
			longitude: loc.coords.longitude,
			images: images,
		}),
	})
	if (res.status !== 200) {
		return Promise.reject(res.status)
	}
	return res.json()
}
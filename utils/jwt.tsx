import * as SecurityStore from "expo-secure-store"

const JWT_TOKEN_KEY = "JWT_TOKEN";

export const getJWTToken = async (): Promise<string> => {
    try {
        const token = await SecurityStore.getItemAsync(JWT_TOKEN_KEY);
        if (!token) {
            return Promise.reject(new Error("empty jwt token"));
        }
        return Promise.resolve(token);
    } catch(e) {
        return Promise.reject(e)
    }
}
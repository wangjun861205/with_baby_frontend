import { useState } from "react"
import { getJWTToken } from "../utils/jwt";

export const useToken = () => {
    const [token, setToken] = useState<string>();
    getJWTToken().then(v => setToken(v)).catch(e => console.error(e));
    return token;
}
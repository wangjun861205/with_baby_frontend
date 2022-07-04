import { useEffect, useState } from "react"
import { getJWTToken } from "../utils/jwt";
import { getItemAsync } from "expo-secure-store"

export type Profile = {
    id: number,
    name: string,
    avatar?: number,
    token: string,
}

export const useProfile = () => {
    const [profile, setProfile] = useState<Profile | null>();
    const [retry, setRetry] = useState(0);
    useEffect(() => {
        getItemAsync("PROFILE").then(v => {
            if (!v) {
                setProfile(null);
                return
            }
           setProfile(JSON.parse(v));
        })
    }, [retry])
    return profile;
}
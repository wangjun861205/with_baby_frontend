import { useEffect, useState } from "react"
import { getJWTToken } from "../utils/jwt";
import { getItemAsync } from "expo-secure-store"

type Profile = {
    id: number,
    name: string,
    avatar: number,
    token: string,
}

export const useProfile = () => {
    const [profile, setProfile] = useState<Profile | null>();
    useEffect(() => {
        getItemAsync("PROFILE").then(v => {
            if (!v) {
                setProfile(null);
                return
            }
           setProfile(JSON.parse(v));
        })
    }, [])
    return profile;
}
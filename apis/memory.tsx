import { kMaxLength } from "buffer";
import { getJWTToken } from "../utils/jwt"
import { BASE_URL } from "@env";
import { NearMemories } from "../models/queries";
import { Memory, Location, Upload } from "../models/models";
import { useEffect, useState } from "react";
import { useProfile } from "../hooks/profile";
import { useCoords } from "../hooks/location";
import { NearMemories as NearMemoriesResp } from "../models/responses";
import { Profile } from "../hooks/profile";
import { SetStateAction } from "react";

type ListParams = {
    limit: number,
    offset: number,
}

export const list = async (location: number, token: string, params: ListParams) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        p.append(k, `${v}`);
    }
    const res = await fetch(BASE_URL + `/api/locations/${location}/memories?${p}`, {
        headers: {
            JWT_TOKEN: token,
        }
    });
    if (res.status !== 200) {
        console.error(res.status)
        return Promise.reject(new Error(`failed to get memories of location(status: ${res.status})`))
    }
    return res.json();
} 


export const nearMemories = (query: NearMemories, profile: Profile, setData: (value: SetStateAction<NearMemoriesResp | undefined>) =>  void)  => {
        const params = new URLSearchParams();
        params.append("latitude", query.latitude.toString());
        params.append("longitude", query.longitude.toString());
        params.append("offset", query.offset.toString());
        params.append("limit", query.limit.toString());
        fetch(BASE_URL + `/api/memories?${params}`, {
            headers: {
                JWT_TOKEN: profile.token,
            }
        }).then(
            res => {
                if (res.status == 200) {
                    return res.json();
                }
                throw new Error(res.status.toString())
            }
        ).then( json => {
            setData(json)
        })
}
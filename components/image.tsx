import { ViewProps, Image, View, ActivityIndicator, Text } from "react-native";
import { useToken } from "../hooks/token";
import { useState } from "react";
import { BASE_URL } from "@env";

interface MyImageProps extends ViewProps {
    id: number,
    width?: number | string,
    height?: number | string,
}

export const MyImage = ({id, width, height} : MyImageProps) => {
    const token = useToken();
    return token ? 
        <Image style={{width: width, height: height}} source={{uri: BASE_URL + `/api/upload/${id}`, headers: {JWT_TOKEN: token}}} /> 
    : <></> 
}

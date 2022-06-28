import { ViewProps, Image, View, ActivityIndicator, Text } from "react-native";
import { useProfile } from "../hooks/profile";
import { useState } from "react";
import { BASE_URL } from "@env";

interface MyImageProps extends ViewProps {
    id: number,
    token: string,
    width?: number | string,
    height?: number | string,
}

export const MyImage = ({id, token, width, height} : MyImageProps) => {
    return <Image style={{width: width, height: height}} source={{uri: BASE_URL + `/api/upload/${id}`, headers: {JWT_TOKEN: token}}} /> 
}

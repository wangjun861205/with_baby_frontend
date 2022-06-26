import * as FS from "expo-file-system";
import { ViewProps, View, Image, TouchableOpacity, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { upload } from "../apis/upload";
import { useEffect, useState } from "react";
import { readAsStringAsync } from "expo-file-system";
import * as Picker from "expo-image-picker";
import React from "react";
import { getJWTToken } from "../utils/jwt";
import { BASE_URL } from "@env";


interface ImageRowProps  extends ViewProps {
    ids: number[],
    headers?: {[key: string]: string},
    onDelete: (id: number) => void,
}

const ImageRow = ({ids, headers, onDelete}: ImageRowProps) => {
    return <View  style={styles.image_container} >
        {
            ids.map(id => (<View style={styles.preview}>
                <TouchableOpacity style={styles.delete_button} onPress={() => { onDelete(id) }}><Text>X</Text></TouchableOpacity>
                <Image style={styles.image} source={{uri: BASE_URL + `/api/upload/${id}`, headers: headers}}/>
                </View>))
        }
    </View>
}

export interface UploadProps extends ViewProps {
    ids: number[],
    setIDs: (value: React.SetStateAction<number[]>) => void
    headers?: {[key: string]: string}
}

type UploadState = {
    uri: string,
    status: "Ready" | "Uploading" | "Downloading" | "Error" | "Done"
    id: number | null,
}

export const Upload = ({ ids, setIDs, headers }: UploadProps) => {
    const onDelete = (id: number) => {
        setIDs(old => old.filter(v => v !== id));
    }

    const doUpload = async (uri: string) => {
        const id = await upload(uri, headers);
        setIDs(old => { let next = [...old, id]; return next });
    }

    const pick = async () => {
        const p = await Picker.requestMediaLibraryPermissionsAsync();
        if (!p.granted) {
            return Promise.reject(new Error("无权限"))
        }
        const result = await Picker.launchImageLibraryAsync({
            mediaTypes: Picker.MediaTypeOptions.Images,
        });
        if (!result.cancelled) {
            doUpload(result.uri).then().catch(e => console.error(e));
        }
    }
    const camera = async () => {
        const p = await Picker.requestCameraPermissionsAsync();
        if (!p.granted) {
            return Promise.reject(new Error("无权限"))
        }
        const result = await Picker.launchCameraAsync({
            mediaTypes: Picker.MediaTypeOptions.Images,
        });
        if (!result.cancelled) {
            doUpload(result.uri).then().catch(e => console.error(e));
        }
    }
    return (
        <View style={styles.container}>
            <ImageRow ids={ids} headers={headers} onDelete={onDelete} />
            <View style={styles.button_container}>
                <TouchableOpacity style={styles.button} onPress={() => pick().then().catch(e => console.error(e))}><Text>图片库</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => camera().then().catch(e => console.error(e))}><Text>拍摄</Text></TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexWrap: "wrap",
        flexDirection: "row",
    },
    button_container: {
        width: "100%",
        justifyContent: "space-around",
        flexDirection: "row",
    },
    button: {
        width: "30%",
        alignItems: "center",
    },
    image_container: {
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    preview: {
        width: 150,
        height: 150,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    delete_button: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1,
    }

})


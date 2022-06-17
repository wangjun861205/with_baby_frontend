import * as FS from "expo-file-system";
import { ViewProps, View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import useAsync from "../hooks/async";
import { upload } from "../apis/upload";
import { useEffect, useState } from "react";
import { readAsStringAsync } from "expo-file-system";
import * as Picker from "expo-image-picker";
import React from "react";

export interface UploadProps extends ViewProps {
    setIDs: (value: React.SetStateAction<number[]>) => void
}

type UploadState = {
    uri: string,
    status: "Uploading" | "Error" | "Done" | "Deleted"
    id: number | null,
}

export const Upload = ({ setIDs }: UploadProps) => {
    const [states, setStates] = useState<UploadState[]>([]);
    const doUpload = async (uri: string) => {
        try {
            const content = await readAsStringAsync(uri, { encoding: FS.EncodingType.Base64 });
            const ids = await upload(content);
            setStates(old => {
                const i = old.findIndex(s => { s.uri == uri });
                const l = [...old];
                if (i === -1) {
                    l.push({
                        uri: uri,
                        status: "Done",
                        id: ids[0],
                    });
                } else {
                    l[i].status = "Done";
                    l[i].id = ids[0];
                }
                setIDs(l.filter(s => s.status === "Done").map(s => s.id!));
                return l;
            });
        } catch (e) {
            setStates(old => {
                const i = old.findIndex(s => { s.uri == uri });
                const l = [...old];
                if (i === -1) {
                    l.push({
                        uri: uri,
                        status: "Done",
                        id: null,
                    })
                    return l
                }
                l[i].status = "Error";
                l[i].id = null;
                return l;
            });
        }
    }

    const pick = async () => {
        const result = await Picker.launchImageLibraryAsync({
            mediaTypes: Picker.MediaTypeOptions.Images,
        });
        if (!result.cancelled) {
            doUpload(result.uri).then().catch(e => console.log(e));
        }
    }
    const camera = async () => {
        const result = await Picker.launchCameraAsync({
            mediaTypes: Picker.MediaTypeOptions.Images,
        });
        if (!result.cancelled) {
            doUpload(result.uri).then().catch(e => console.log(e));
        }
    }
    const del = (uri: string) => {
        setStates(old => {
            const l = [...old];
            l[l.findIndex(v => v.uri === uri)].status = "Deleted";
            setIDs(l.filter(v => v.status === "Done").map(v => v.id!));
            return l;
        });
    }
    return (
        <View style={styles.button_container}>
            <View style={styles.image_container}>
                {
                    states.filter(img => img.status !== "Deleted").map(u => <View style={styles.preview} key={u.uri}>
                        <TouchableOpacity style={styles.delete_button} onPress={() => { del(u.uri) }}><Text>X</Text></TouchableOpacity>
                        <Image style={styles.image} source={{ uri: u.uri }} />
                    </View>)
                }
            </View>
            <View style={styles.button_container}>
                <TouchableOpacity style={styles.button} onPress={() => pick().then().catch(e => console.log(e))}><Text>图片库</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => camera().then().catch(e => console.log(e))}><Text>拍摄</Text></TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    button_container: {
        flexWrap: "wrap",
        flexDirection: "row",
        width: "100%",
        height: 200,
        // height: "100%",
    },
    button: {
        width: "20%",
        height: "20%",
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


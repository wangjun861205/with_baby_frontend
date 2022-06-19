import * as FS from "expo-file-system";
import { ViewProps, View, Image, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
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
    useEffect(() => {
        setIDs(states.filter(s => s.status === "Done").map(s => s.id!));
    }, [states]);

    useEffect(() => {
        states.filter(({status}) => status === "Uploading").forEach(({uri}) => {
            readAsStringAsync(uri, { encoding: FS.EncodingType.Base64 }).then( content => {
                upload(content).then(id => {
                    setStates(old => {
                        let next = [...old];
                        next[next.findIndex(v => v.uri === uri)].status = "Done";
                        next[next.findIndex(v => v.uri === uri)].id = id[0];
                        return next;
                    });
                }).catch(reason => console.error(reason))
            }).catch(reason => console.error(reason))
        })
    })

    const doUpload = async (uri: string) => {
        setStates(old => [...old, {uri: uri, status: "Uploading", id: null}]);
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
            return l;
        });
    }
    return (
        <View style={styles.container}>
            <View style={styles.image_container}>
                {
                    states.filter(img => img.status !== "Deleted").map(u => <View style={styles.preview} key={u.uri}>
                        <TouchableOpacity style={styles.delete_button} onPress={() => { del(u.uri) }}><Text>X</Text></TouchableOpacity>
                        <Image style={styles.image} source={{ uri: u.uri }} blurRadius={u.status === "Uploading" ? 200 : 0}/>
                        <ActivityIndicator style={ {position: "absolute", width: "100%", height: "100%"} } animating={u.status === "Uploading"} hidesWhenStopped={true} size="large" />
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


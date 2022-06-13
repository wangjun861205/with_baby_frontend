import * as FS from "expo-file-system";
import { ViewProps, View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import useAsync from "../hooks/async";
import { upload } from "../apis/upload";
import { useEffect, useState } from "react";
import { readAsStringAsync } from "expo-file-system";
import * as Picker from "expo-image-picker";

export interface UploadProps extends ViewProps {
    hasCanceled: boolean,
    setIDs: (ids: number[]) => void,
}

type UploadState = {
    uri: string,
    status: "Uploading" | "Error" | "Done"
    id: number | null,
}

export const Upload = ({ hasCanceled, setIDs }: UploadProps) => {
    const [states, setStates] = useState<UploadState[]>([]);
    const doUpload = async (uri: string) => {
        try {
            const content = await readAsStringAsync(uri, { encoding: FS.EncodingType.Base64 });
            const id = await upload(content);
            setStates(old => {
                const i = old.findIndex(s => { s.uri == uri });
                if (i === -1) {
                    return old;
                }
                old[i].status = "Done";
                old[i].id = id;
                return old;
            });
            setIDs(states.filter(s => s.id).map(s => s.id!));
        } catch (e) {
            setStates(old => {
                const i = old.findIndex(s => { s.uri == uri });
                if (i === -1) {
                    return old
                }
                old[i].status = "Error";
                return old;
            });
        }
    }

    const pick = async () => {
        if (hasCanceled) {
            return;
        }
        const result = await Picker.launchImageLibraryAsync({
            mediaTypes: Picker.MediaTypeOptions.Images,
        });
        if (!result.cancelled) {
            doUpload(result.uri).then();
        }
    }
    const camera = async () => {
        if (hasCanceled) {
            return;
        }
        const result = await Picker.launchCameraAsync({
            mediaTypes: Picker.MediaTypeOptions.Images,
        });
        if (!result.cancelled) {
            doUpload(result.uri).then()
        }
    }
    const del = (uri: string) => {
        setStates(old => old.filter(u => u.uri !== uri));
    }
    return (
        <View style={styles.button_container}>
            <View style={styles.image_container}>
                {
                    states.map(u => <View style={styles.preview} key={u.uri}>
                        <TouchableOpacity style={styles.delete_button} onPress={() => { del(u.uri) }}><Text>X</Text></TouchableOpacity>
                        <Image style={styles.image} source={{ uri: u.uri }} />
                    </View>)
                }
            </View>
            <View style={styles.button_container}>
                <TouchableOpacity style={styles.button} onPress={pick}><Text>图片库</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={camera}><Text>拍摄</Text></TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    button_container: {
        flexWrap: "wrap",
        flexDirection: "row",
        width: "100%",
        height: "100%",
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


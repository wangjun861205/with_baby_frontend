import * as FS from "expo-file-system";
import { ViewProps, View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import useAsync from "../hooks/async";
import { upload } from "../apis/upload";
import { useEffect, useState } from "react";
import { readAsStringAsync } from "expo-file-system";
import * as Picker from "expo-image-picker";

export interface UploadProps extends ViewProps {
    url: string
}

export const Upload = () => {
    const [uris, setUris] = useState<string[]>([]);
    const pick = async () => {
        const result = await Picker.launchImageLibraryAsync({
            mediaTypes: Picker.MediaTypeOptions.Images,
        });
        if (!result.cancelled) {
            setUris(old => [...old, result.uri]);
        }
    }
    const camera = async () => {
        const result = await Picker.launchCameraAsync({
            mediaTypes: Picker.MediaTypeOptions.Images,
        });
        if (!result.cancelled) {
            setUris(old => [...old, result.uri]);
        }
    }
    return (
        <View style={styles.button_container}>
            <TouchableOpacity style={styles.button} onPress={pick}><Text>图片库</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={camera}><Text>拍摄</Text></TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    button_container: {
        flexWrap: "wrap"
    },
    button: {
        width: "20%",
        height: "20%",
    }
})


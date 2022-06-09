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
    const del = (uri: string) => {
        setUris(old => old.filter(u => u !== uri));
    }
    return (
        <View style={styles.button_container}>
            <View style={styles.image_container}>
                {
                    uris.map(u => <View style={styles.preview} key={u}>
                        <TouchableOpacity style={styles.delete_button} onPress={() => { del(u)}}><Text>X</Text></TouchableOpacity>
                        <Image style={styles.image} source={{uri: u}}/>
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


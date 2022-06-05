import { Camera, CameraType, requestCameraPermissionsAsync } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet} from "react-native";

export const Photo = ({navigation, route}: {navigation: any, route: any}) => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isMounted, setMounted] = useState(true);
    const [type, setType] = useState(CameraType.back);
    let camera: Camera | null;
    
    useEffect(() => {
        (async () => { 
            const { status } = await requestCameraPermissionsAsync();
            isMounted && setHasPermission(status === 'granted');
        })();
        return () => setMounted(false);
    }, [])

    return <View>
        <Camera style={styles.camera} ref={(r) => camera = r} type={type}> 
            <View>
                <TouchableOpacity style={styles.flip} onPress={() => {
                    setType(type === CameraType.back ? CameraType.front : CameraType.back);
                }}>
                    <Text>切换</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.capture} onPress={() => {
                    camera?.takePictureAsync().then(p => route.params.addImage(p.uri)).catch(reason => alert(reason));
                    navigation.goBack();
                }}>
                    <Text>拍摄</Text>
                </TouchableOpacity>
            </View>
        </Camera> 
    </View>

}

const styles = StyleSheet.create({
    camera: {
        width: "100%",
        height: "100%",
    },
    flip: {
        position: "absolute",
        right: "5%",
    },
    capture: {
    }
})
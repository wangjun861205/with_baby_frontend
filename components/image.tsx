import { Image, View, StyleSheet, TouchableOpacity, Text, ViewProps } from "react-native";

export interface ImagePreviewProp extends ViewProps {
    uri: string,
    onDelete: (uri: string) => void, 
}
export const ImagePreview = ({uri, onDelete, style}: ImagePreviewProp) => {
    return <View style={style}>
        <TouchableOpacity style={styles.delete} onPress={() => onDelete(uri)}><Text>x</Text></TouchableOpacity>
        <Image style={styles.image} source={{uri: uri}} />
    </View>
}

const styles = StyleSheet.create({
    delete: {
        position: "absolute",
        right: "5%",
        zIndex: 1,
    },
    image: {
        width: "100%",
        height: "100%",
    }

})
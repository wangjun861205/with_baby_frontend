import { PropsWithChildren } from "react";
import { View, ViewProps, Button, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface WithNavigationProps extends ViewProps {
    current: string,
    navigation: any,
}

export const WithNavigation = ({children, current, navigation}: PropsWithChildren<WithNavigationProps> ) => {
    const insets = useSafeAreaInsets();
    return <View style={{paddingTop: insets.top * 1.5}}>
                <ScrollView style={styles.content}>
                { children }
                </ScrollView>
            <View style={styles.bar}>
                <View style={current === "locations" ? [ styles.button, styles["high-light"]]: styles.button}><Button title="发现" onPress={() => {navigation.navigate("LocationList")}}/></View>
                <View style={current === "memories" ? [ styles.button, styles["high-light"]]: styles.button }><Button title="回忆" /></View>
                <View style={current === "me" ? [ styles.button, styles["high-light"]]: styles.button}><Button title="我的" /></View>
            </View>
        </View>
}

const styles = StyleSheet.create({
    content: {
        height: "90%",
        width: "100%",
    },
    bar: {
        width: '100%',
        height: "10%",
        backgroundColor: '#EE5407',
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    button: {
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    "high-light": {
        backgroundColor: "#ffffff",
    }


})
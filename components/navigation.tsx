import { PropsWithChildren } from "react";
import { View, ViewProps, Button, StyleSheet, ScrollView, Image, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BASE_URL } from "@env"

interface WithNavigationProps extends ViewProps {
    current: string,
    navigation: any,
    token: string,
    username: string,
    avatar?: number,
}

export const WithNavigation = ({children, current, navigation, token, username, avatar}: PropsWithChildren<WithNavigationProps> ) => {
    const insets = useSafeAreaInsets();
    return  <View style={{paddingTop: insets.top * 1.5,  flex: 1, flexDirection: "column"}}>
                <View style={styles.headbar}>
                    { avatar ? <Image source={{uri: BASE_URL + `/api/upload/${avatar}`, headers:{JWT_TOKEN: token}}} /> : <></> }
                    <Text style={styles.username}>{username}</Text>
                </View>
                <View style={styles.content}>
                    <ScrollView>
                    { children }
                    </ScrollView>
                </View>
                <View style={styles.bar}>
                    <View style={current === "locations" ? [ styles.button, styles["high-light"]]: styles.button}><Button title="发现" onPress={() => {navigation.navigate("LocationList")}}/></View>
                    <View style={current === "memories" ? [ styles.button, styles["high-light"]]: styles.button }><Button title="回忆" /></View>
                    <View style={current === "me" ? [ styles.button, styles["high-light"]]: styles.button}><Button title="我的" /></View>
                </View>
            </View>
}

const styles = StyleSheet.create({
    content: {
        flex: 10,
        width: "100%",
    },
    bar: {
        flex: 1,
        width: '100%',
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
    },
    headbar: {
        flex: 1,
        flexDirection: "row-reverse",  
        alignItems: "center",
    },
    username: {
        paddingRight: 20,
    }


})
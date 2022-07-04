import { PropsWithChildren } from "react";
import { View, ViewProps, Button, StyleSheet, ScrollView, Image, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BASE_URL } from "@env"
import { Profile } from "../hooks/profile";

interface WithNavigationProps extends ViewProps {
    current: string,
    navigation: any,
    profile: Profile,
}

export const WithNavigation = ({children, current, navigation, profile}: PropsWithChildren<WithNavigationProps> ) => {
    const insets = useSafeAreaInsets();
    return  <View style={{paddingTop: insets.top * 1.5,  flex: 1, flexDirection: "column"}}>
                    <TouchableOpacity style={styles.headbar} onPress={() => {navigation.navigate("Profile")}}>
                        { profile.avatar ? <Image style={styles.avatar} source={{uri: BASE_URL + `/api/upload/${profile.avatar}`, headers:{JWT_TOKEN: profile.token}}} /> : <></> }
                        <Text style={styles.username}>{profile.name}</Text>
                    </TouchableOpacity>
                <View style={styles.content}>
                    { children }
                </View>
                <View style={styles.bar}>
                    <View style={current === "locations" ? [ styles.button, styles["high-light"]]: styles.button}><Button title="发现" onPress={() => {navigation.navigate("LocationList")}}/></View>
                    <View style={current === "memories" ? [ styles.button, styles["high-light"]]: styles.button }><Button title="回忆" onPress={() => navigation.navigate("NearMemories") }/></View>
                    <View style={current === "my" ? [ styles.button, styles["high-light"]]: styles.button}><Button title="我的" onPress={() => navigation.navigate("My")}/></View>
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
        flex: 1,
    },
    "high-light": {
        backgroundColor: "#FE9447",
    },
    headbar: {
        flex: 1,
        flexDirection: "row-reverse",  
        alignItems: "center",
        backgroundColor: '#EE5407',
    },
    username: {
        paddingRight: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 20,
    }


})
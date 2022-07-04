import { WithNavigation } from "../components/navigation"
import { useProfile } from "../hooks/profile"
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";

export const My = ({navigation, route}: {navigation: any, route: any}) => {
    const profile = useProfile();
    return profile ? 
    <WithNavigation current="my" navigation={navigation} profile={profile}>
        <View style={styles.container}>
            <TouchableOpacity style={styles.item}><Text>我的发现</Text></TouchableOpacity>
            <TouchableOpacity style={styles.item}><Text>我的回忆</Text></TouchableOpacity>
        </View>
    </WithNavigation> :
    <ActivityIndicator animating={true} />
}

const styles = StyleSheet.create({
    container: {
        width: "60%",
        height: 300,
        borderRadius: 50,
        backgroundColor: "#ccccaa",
        alignSelf: "center",
        marginTop: 50,
    },
    item: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})
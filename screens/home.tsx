import { useEffect } from 'react';
import { Text, Button, StyleSheet, View, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Location from "expo-location";

const Home = ({ navigation }: { navigation: any }) => {
    return <View>
        <TouchableOpacity onPress={() => {
            navigation.navigate("LocationList");
        }} style={[styles.textContainer, styles.yellow]} >
            <Text style={styles.text}>玩</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { navigation.navigate("CreateLocation") }} style={[styles.textContainer, styles.cyan]}>
            <Text style={styles.text}>吃</Text>
        </TouchableOpacity>
    </View>
}


const styles = StyleSheet.create({
    textContainer: {
        justifyContent: "center",
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        height: "50%",
    },
    yellow: {
        backgroundColor: "#ffff00",
    },
    cyan: {
        backgroundColor: "#00ffff",
    },
    text: {
        textAlign: "center",
        fontSize: 30,
    }

})

export default Home;
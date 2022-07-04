import { useState } from "react";
import { TextInput, View, StyleSheet, Button, Keyboard, TouchableWithoutFeedback } from "react-native";
import * as SecureStore from "expo-secure-store";
import {BASE_URL} from "@env";


const Signin = ({ navigation, route }: { navigation: any, route: any }) => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const signin = () => {
        fetch(`${BASE_URL}/user/signin`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: phone,
                password: password
            })
        }).then(res => res.text().then(s => { 
            SecureStore.setItemAsync("PROFILE", s )
            .then(() => {
                navigation.navigate("LocationList");
            }).catch(e => console.error(e));
        })).catch(err => console.error(err));
    }
    return <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
                <View style={styles.container}>
                    <View style={styles.form}>
                        <TextInput style={styles.phone} placeholder="Phone..." onChangeText={setPhone} />
                        <TextInput style={styles.password} placeholder="Password..." secureTextEntry={true} onChangeText={setPassword} />
                        <View style={styles.button}><Button onPress={signin} title="Signin" /></View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
}


const styles = StyleSheet.create(
    {
        container: {
            width: "100%",
            height: "100%",
        },
        form: {
            position: "relative",
            width: "80%",
            height: "40%",
            backgroundColor: "#bbcc9f",
            borderRadius: 25,
            alignSelf: "center",
            flexDirection: "column",
            top: "20%",
        },
        phone: {
            paddingLeft: "20%",
            paddingRight: "20%",
            fontSize: 20,
            flex: 3,
        },
        password: {
            paddingLeft: "20%",
            paddingRight: "20%",
            fontSize: 20,
            flex: 3,
        },
        button: {
            flex: 2,
        }
        
    }
)

export default Signin;
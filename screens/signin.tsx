import { useState } from "react";
import { TextInput, View, StyleSheet, Button } from "react-native";
import * as SecureStore from "expo-secure-store";

const Signin = ({navigation}: {navigation: any}) => {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const signin = () => {
        fetch('http://192.168.3.11:8000/signin', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: phone,
                password: password
            })
        }).then(res => res.text().then(s => SecureStore.setItemAsync("JWT_TOKEN", s).then(navigation.navigate("Home")) )).catch(err => alert(err));
    }
    return <View>
        <TextInput style={styles.phone} placeholder="Phone..." onChangeText={setPhone}/>
        <TextInput style={styles.password} placeholder="Password..." secureTextEntry={true} onChangeText={setPassword}/>
        <Button onPress={signin} title="Signin" />
    </View>
}


const styles = StyleSheet.create(
   {
    phone: {
        width: "100%",
        height: "20%",
    },
    password: {
        width: "100%",
        height: "20%",
    }
   } 
)

export default Signin;
import { useState } from "react";
import { TextInput, View, StyleSheet, Button } from "react-native";

const Signin = () => {
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
        }).then(res => alert(res.status)).catch(err => alert(err));
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
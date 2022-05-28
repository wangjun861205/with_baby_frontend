import {useEffect, useState} from "react";
import { View, TextInput, Button } from "react-native";
import { BASE_URL } from "../App";
import * as SecurityStore from "expo-secure-store"
import Geolocation from "react-native-geolocation-service";

interface Playing {
    name: string,
    latitude: number,
    longitude: number,
}

export const PlayingList = ({navigation}: {navigation: any}) => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [playings, setPlayings] = useState<Playing[]>([]);
    const fetchData = () => {
        Geolocation.getCurrentPosition(loc => {
            fetch(BASE_URL + `/api/playings?page=${page}&size=${size}&latitude=${loc.coords.latitude}&longitude=${loc.coords.longitude}`, {method: "get"})
            .then(res => {
                res.json().then(obj => setPlayings(obj)).catch(err => console.error(err))
            })
            .catch(err => console.error(err));
        }, err => alert(err))
    }
    useEffect(fetchData, []);
    return <View>
        { playings.map(p => <div>{p.name}</div>) }
    </View>
}

interface CreateRequest {
    name: string,
    latitude: number,
    longitude: number,

}

export const PlayingCreate = ({navigation}: {navigation: any}) => {
    const [data, setData] = useState<CreateRequest>({name: "", latitude: 0, longitude: 0});
    const submit = () => {
        SecurityStore.getItemAsync("JWT_TOKEN").then(v => {
            if (v === null) {
                navigation.navigate("Signin");
                return
            }
            fetch(BASE_URL + '/api/playings', {
                method: "post", 
                headers: {
                    "Content-Type": "application/json",
                    "JWT_TOKEN": v,
                }, 
                body: JSON.stringify(data)}).then(res => {
                    if (res.status !== 200) {
                        alert(res.body);
                        return
                    }
                    alert("success");
                }).catch(err => alert(err));
            }).catch(err => alert(err));
    }

    return <View>
        <TextInput placeholder="Name" onChangeText={(name) =>  {setData(old => ({...old, name: name}) )}}/>
        <TextInput placeholder="Latitude" onChangeText={(name) =>  {setData(old => ({...old, name: name}) )}}/>
        <TextInput placeholder="Longitude" onChangeText={(name) =>  {setData(old => ({...old, name: name}) )}}/>
        <Button title="Create" onPress={submit} />
    </View>
}

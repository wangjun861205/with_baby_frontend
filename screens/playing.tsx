import {useEffect, useState} from "react";
import { View, TextInput, Button, Text } from "react-native";
import * as SecurityStore from "expo-secure-store"
import * as Location from "expo-location";
import { getLocation } from "../utils/location";
import { getJWTToken } from "../utils/jwt";
import { nearbyPlayings } from "../apis/playing";
import { BASE_URL } from "../apis/urls";
import { Playing } from "../apis/models";




export const PlayingList = ({navigation, route}: {navigation: any, route: any}) => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [playings, setPlayings] = useState<Playing[]>([]);
    const query = async () => {
        try {
            const token = await getJWTToken();
            const {coords: {latitude, longitude}} = await getLocation();
            return  nearbyPlayings({page: page, size: size, latitude: latitude, longitude: longitude, token});
        } catch(e) {
            return Promise.reject(e);
        }
    }
    const fetchData = () => {
        query().then(res => {
            setPlayings(res.list);
        }).catch(e => alert(e));
    }
    useEffect(fetchData, []);
    return <View>
        { playings.map(p => <Text key={p.id}>{p.name}</Text>) }
    </View>
}

interface CreateRequest {
    name: string,
    latitude: number,
    longitude: number,

}

export const PlayingCreate = ({navigation, route}: {navigation: any, route: any}) => {
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

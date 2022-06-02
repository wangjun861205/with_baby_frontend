import { useEffect, useState } from "react";
import { View, TextInput, Button, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import * as SecurityStore from "expo-secure-store"
import { getLocation } from "../utils/location";
import { getJWTToken } from "../utils/jwt";
import { nearbyPlayings } from "../apis/playing";
import { BASE_URL } from "../apis/urls";
import { Playing } from "../apis/models";
import AppLink from "react-native-app-link";




export const PlayingList = ({ navigation, route }: { navigation: any, route: any }) => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [playings, setPlayings] = useState<Playing[]>([]);
    let _mounted = true;
    const query = async () => {
        try {
            const token = await getJWTToken();
            const { coords: { latitude, longitude } } = await getLocation();
            return nearbyPlayings({ page: page, size: size, latitude: latitude, longitude: longitude, token });
        } catch (e) {
            return Promise.reject(e);
        }
    }
    const fetchData = () => {
        query().then(res => {
            if (_mounted) setPlayings(res.list);
        }).catch(e => alert(e));
    }
    const jumpToNav = (latitude: number, longitude: number) => {
        AppLink.maybeOpenURL(`baidumap://map/navi?coord_type=wgs84&location=${latitude},${longitude}`, { appName: "BaiduMaps", appStoreId: 0, appStoreLocale: "cn", playStoreId: "" })
            .then(v => { })
            .catch(e => alert(e));
    }
    useEffect(() => {
        fetchData();
        return () => {
            _mounted = false;
        }
    }, []);
    return <View>
        <FlatList data={playings} renderItem={({ item, index }) =>
            <TouchableOpacity style={index % 2 == 0 ? [styles["list-row"], styles["list-row-even"]] : [styles["list-row"], styles["list-row-odd"]]} onPress={() => {
                jumpToNav(item.latitude, item.latitude);
            }}><Text>名称:{item.name} 发现者:{item.discoverer.name} 距离:{Math.round(item.distance) + "m"}</Text></TouchableOpacity>
        } />
    </View>
}


const styles = StyleSheet.create({
    "list-row": {
        height: 50,
        width: 100,
    },
    "list-row-odd": {
        backgroundColor: "#aaffff",
    },
    "list-row-even": {
        backgroundColor: "#cceeee",
    }

})



interface CreateRequest {
    name: string,
    latitude: number,
    longitude: number,

}

export const PlayingCreate = ({ navigation, route }: { navigation: any, route: any }) => {
    const [data, setData] = useState<CreateRequest>({ name: "", latitude: 0, longitude: 0 });
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
                body: JSON.stringify(data)
            }).then(res => {
                if (res.status !== 200) {
                    alert(res.body);
                    return
                }
                alert("success");
            }).catch(err => alert(err));
        }).catch(err => alert(err));
    }

    return <View>
        <TextInput placeholder="Name" onChangeText={(name) => { setData(old => ({ ...old, name: name })) }} />
        <TextInput placeholder="Latitude" onChangeText={(name) => { setData(old => ({ ...old, name: name })) }} />
        <TextInput placeholder="Longitude" onChangeText={(name) => { setData(old => ({ ...old, name: name })) }} />
        <Button title="Create" onPress={submit} />
    </View>
}

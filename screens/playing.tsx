import { useEffect, useState } from "react";
import { View, TextInput, Button, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import * as SecurityStore from "expo-secure-store"
import { getLocation } from "../utils/location";
import { getJWTToken } from "../utils/jwt";
import { nearbyPlayings } from "../apis/playing";
import { BASE_URL } from "../apis/urls";
import { Playing } from "../apis/models";
import AppLink from "react-native-app-link";
import { ImagePreview } from "../components/image"
import * as FS from "expo-file-system";




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
            .then((_: any) => { })
            .catch((e: any) => alert(e));
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
        <Button title="新建" onPress={() => navigation.navigate("PlayingCreate")} />
    </View>
}


const styles = StyleSheet.create({
    "list-row": {
        height: 50,
        width: 400,
    },
    "list-row-odd": {
        backgroundColor: "#aaffff",
    },
    "list-row-even": {
        backgroundColor: "#cceeee",
    },
    image: {
        width: 120,
        height: 120,
    }

})



interface CreateRequest {
    name: string,
    latitude: number,
    longitude: number,
    images: string[],

}

export const PlayingCreate = ({ navigation, route }: { navigation: any, route: any }) => {
    const [data, setData] = useState<CreateRequest>({ name: "", latitude: 0, longitude: 0, images: [] });
    let isMounted = true;
    useEffect(() => {
        if (isMounted) {
            getLocation().then((loc) => {
                if (isMounted) {
                    setData((old) => {
                        return {
                            ...old,
                            latitude: loc.coords.latitude,
                            longitude: loc.coords.longitude,
                        }
                    });
                }
                return () => {
                    isMounted = false;
                }
            }).catch(reason => alert(reason));
        }
    }, []);

    const uploadImage = async (jwt: string): Promise<number[]> => {
        let formData = new FormData();
        for (var img of data.images) {
           const content = await FS.readAsStringAsync(img, {encoding: FS.EncodingType.Base64});
           formData.append("file", content);
        }
        const res = await fetch(BASE_URL + "/api/upload", {
            method: "POST",
            headers: {
                "JWT_TOKEN": jwt,
            },
            body: formData,
        });
        if (res.status !== 200) {
            return Promise.reject(res.statusText);
        }
        return res.json()
    }

    const submit = async () => {
            const jwt = await SecurityStore.getItemAsync("JWT_TOKEN");
            if (!jwt) {
                navigation.navigate("Signin");
                return Promise.reject("empty jwt token");
            }
            const imageIds = await uploadImage(jwt);
            const loc = await getLocation();
            const res = await fetch(BASE_URL + '/api/playings', {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "JWT_TOKEN": jwt,
                },
                body: JSON.stringify({
                    name: data.name,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    images: imageIds,
                })
            });
            if (res.status !== 200) {
                return Promise.reject("failed to create playing")
            }
    }

    const deleteImage = (uri: string) => {
        setData(
            (old) => ({
                ...old,
                images: old.images.filter(u => u !== uri)
            })
        )
    }

    const addImage = (uri: string) => {
        console.log(data);
        setData((old) => ({
            ...old,
            images: [...old.images, uri],
        }))
    }

    return <View>
        <TextInput placeholder="Name" onChangeText={(name) => { setData(old => ({ ...old, name: name })) }} />
        <View style={{flexDirection: "row", justifyContent: "space-evenly", flexWrap: "wrap"}}>
            {
                data.images.map(uri => <ImagePreview style={styles.image} key={uri} uri={uri} onDelete={deleteImage}/>)
            }
        </View>
        <Button title="拍照" onPress={() => {
            navigation.navigate("Photo", { addImage: addImage });
        }} />
        <Button title="创建" onPress={() => { submit().then(v => {}).catch(reason => alert(reason))}} />
    </View>
}


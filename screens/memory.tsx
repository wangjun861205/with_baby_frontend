import {View, TextInput, ScrollView, ViewProps, Button, Text, Image, StyleSheet, ActivityIndicator} from "react-native";
import { useEffect, useState } from "react";
import { Upload } from "../components/upload";
import { useCoords } from "../hooks/location";
import { useProfile } from "../hooks/profile";
import { BASE_URL } from "@env";
import { WithNavigation } from "../components/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { list, nearMemories, userNearMemories } from "../apis/memory";
import { List as MemoryList } from "../components/memory";
import { NearMemories as NearMemoriesResp } from "../models/responses";


interface CreateProps extends ViewProps {
    locationID: number
}

export const Create = ({navigation, route}: {navigation: any, route: any}) => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [imgs, setImgs] = useState<number[]>([]);
    const profile = useProfile();

    const create = (token: string) => {
        fetch(BASE_URL + `/api/locations/${route.params.locationID}/memories`, {
            method: "POST",
            headers:  {
                "Content-Type": "application/json",
                JWT_TOKEN: token,
            },
            body: JSON.stringify({
                title: title,
                content: content,
                images: imgs,
            })
        }).then(res => { if (res.status !== 200) throw new Error(`failed to create memory(staus: ${res.status})`) }).catch(e => console.error(e));
    }

    return !profile ? <ActivityIndicator animating={true} /> : <WithNavigation current="memories" navigation={navigation} username={profile.name} avatar={profile.avatar} token={profile.token}>
            <TextInput placeholder="Title" onChangeText={v => setTitle(v)} />
            <TextInput placeholder="Content" multiline={true} numberOfLines={10} onChangeText={v => setContent(v)}/>
            <Upload ids={imgs} setIDs={setImgs} headers={{JWT_TOKEN: profile.token}} />
            <Button title="创建" onPress={() => create(profile.token)}/>
        </WithNavigation>
}


type Memory = {
    id: number,
    title: string,
    content: string,
    create_on: string,
}

export const List = ({navigation, route}: {navigation: any, route: any}) => {
    const [data, setData] = useState<[Memory, {id: number}[]][]>([]);
    const [total, setTotal] = useState<number>(0);
    const [limit, setLimit] = useState<number>(10);
    const [offset, setOffset] = useState<number>(0);
    const profile = useProfile();
    let isMounted = true;
    useEffect(() => {
        if (profile === null) {
            navigation.navigate("Signin", {from: "MemoryList"});
            return
        }
        if (!profile) {
            return
        }
        list(route.params.locationID, profile.token, {limit: limit, offset: offset}).then(
            res => {
                if (isMounted) {
                    setData(res.list);
                    setTotal(res.total);
                }
            }
        ).catch(e => console.error(e));
        return () => { isMounted = false };
    }, [])

    return !data || !profile 
    ? <ActivityIndicator animating={true} />
    : <WithNavigation current="memories" navigation={navigation} username={profile.name} token={profile.token} avatar={profile.avatar}>
        {
            data.map(m => (<View style={styles.row} key={m[0].id}>
                <Text>{m[0].title}</Text>
                <Text>{m[0].content}</Text>
                <Text>{m[0].create_on}</Text>
                <View style={styles.row}>
                    {
                        m[1].map(img => (<Image style={styles.image} source={{uri: BASE_URL + `/api/upload/${img.id}`}} />))
                    }
                </View>
            </View>))
        }
    </WithNavigation>
}

export const NearMemories = ({navigation, route}: {navigation: any, route: any}) => {
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [data, setData] = useState<NearMemoriesResp>();
    const profile = useProfile();
    const coords = useCoords();
    let isMounted = true;

    useEffect(() => {
        if (!profile || !coords) {
            return () => { isMounted = true };
        }
        nearMemories({latitude: coords.latitude, longitude: coords.longitude, limit: limit, offset: offset}, profile, setData);
    }, [profile, coords, limit, offset])

    return data && profile 
    ? 
    <WithNavigation current="memories" navigation={navigation} profile={profile}>
        <MemoryList list={data.list} onPress={(id: number) => {}} />      
        <Button title="test" onPress={() => { setOffset(10)}} />
    </WithNavigation>
    :
    <ActivityIndicator animating={true} />
}


const styles = StyleSheet.create({
    row: {
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    image: {
        width: 100,
        height: 100,
    }
})

import {View, TextInput, ScrollView, ViewProps, Button, Text, Image, StyleSheet} from "react-native";
import { useEffect, useState } from "react";
import { Upload } from "../components/upload";
import { useLocation } from "../hooks/location";
import { useToken } from "../hooks/token";
import { BASE_URL } from "@env";
import { WithNavigation } from "../components/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { list } from "../apis/memory";


interface CreateProps extends ViewProps {
    locationID: number
}

export const Create = ({navigation, route}: {navigation: any, route: any}) => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [imgs, setImgs] = useState<number[]>([]);
    const token = useToken();

    const create = () => {
        fetch(BASE_URL + `/api/locations/${route.params.locationID}/memories`, {
            method: "POST",
            headers:  {
                "Content-Type": "application/json",
                JWT_TOKEN: token!,
            },
            body: JSON.stringify({
                title: title,
                content: content,
                images: imgs,
            })
        }).then(res => { if (res.status !== 200) throw new Error(`failed to create memory(staus: ${res.status})`) }).catch(e => console.error(e));
    }

    return <WithNavigation current="memories">
            <TextInput placeholder="Title" onChangeText={v => setTitle(v)} />
            <TextInput placeholder="Content" multiline={true} numberOfLines={10} onChangeText={v => setContent(v)}/>
            { token ? <Upload ids={imgs} setIDs={setImgs} headers={{JWT_TOKEN: token}}/> : <></> }
            <Button title="创建" onPress={create}/>
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
    let isMounted = true;
    useEffect(() => {
        list(route.params.locationID, {limit: limit, offset: offset}).then(
            res => {
                if (isMounted) {
                    setData(res.list);
                    setTotal(res.total);
                }
            }
        ).catch(e => console.error(e));
        return () => { isMounted = false };
    }, [])

    return <WithNavigation current="memories" navigation={navigation}>
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
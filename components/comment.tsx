import { Text, TextInput, Button, ActivityIndicator, ViewProps , View, StyleSheet, TouchableOpacity} from "react-native";
import { useEffect, useState } from "react";
import { AirbnbRating } from "react-native-ratings";
import { WithNavigation } from "./navigation";
import { useProfile } from "../hooks/profile"
import { useCoords } from "../hooks/location";
import { BASE_URL } from "@env";

export type Comment = {
    rank: number,
    content: string,
}

interface UpsertProps extends ViewProps {
    location_id: number,
    token: string,
    navigation: any,
}

export const Upsert = ({navigation, location_id, token}: UpsertProps) => {
    const [data, setData] = useState<Comment | null>();
    let isMounted = true;
    useEffect(() => {
        fetch(BASE_URL + `/api/locations/${location_id}/comment`, {headers: {JWT_TOKEN: token}}).then(res => {
            if (res.status !== 200) {
                if (res.status === 403) {
                    navigation.navigate("Signin", {from: "UpsertComment", params: {navigation: navigation, location_id: location_id, token: token}})
                    return
                }
                console.error(res.status);
                return
            }
            res.json().then(v => { if (isMounted) { setData(v) }}).catch(e => console.error(e));
        }).catch(e => console.error(e));
        return () => {
            isMounted = false;
        }
    }, []);

    const upsert = () => {
        console.log(data);
        fetch(BASE_URL + `/api/locations/${location_id}/comments`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                JWT_TOKEN: token,
            },
            body: JSON.stringify(data)
        }).then(res => res.status == 200 ? alert("成功") : console.error(res.status)).catch( e => console.error(e))
    }

    return data !== undefined
    ? <>
        <AirbnbRating onFinishRating={(v) => {
            if (isMounted) {
                setData(old => (old  ? { ...old, rank: v} : { content: "", rank: v}) );
            }
        }} count={5} defaultRating={data?.rank} />
        <TextInput defaultValue={data?.content} multiline={true} numberOfLines={10} onChangeText={(v) => {
            if (isMounted) {
                setData(old => (old ? { ...old, content: v} : { content: v, rank: 3}));
            }
        }} />
        <Button title="提交" onPress={upsert} />
        </>
    : <ActivityIndicator animating={true} />
}

interface ListProps extends ViewProps {
    comments: (Comment & {id: number })[],
    onPress: (id: number) => void,
}

export const List = ({comments, onPress}: ListProps) => {
    return <>{
        comments.map(c => {
            return <TouchableOpacity key={c.id} onPress={() => {onPress(c.id)}} style={styles.row}><Text>内容: {c.content}</Text><Text>评分: { c.rank }</Text></TouchableOpacity>
        })
    }</>
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
})
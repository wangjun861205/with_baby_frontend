import { useState , useEffect} from "react";
import {View, Button, Text, ActivityIndicator} from "react-native";
import { useProfile } from "../hooks/profile";
import { Upload } from "../components/upload";
import { BASE_URL } from "@env";
import { WithNavigation } from "../components/navigation";
import { getItemAsync, setItemAsync } from "expo-secure-store"
import { deleteItemAsync } from "expo-secure-store"


const Profile = ({navigation, route}: {navigation: any, route: any}) => {
    return <View>
        <Text>This is profile</Text>
        <Button title="Back to home" onPress={() => {navigation.navigate("Home");}} />
    </View>
}

export default Profile;

export const Update = ({navigation, route}: {navigation: any, route: any}) => {
    const profile = useProfile();
    const [avatar, setAvatar] = useState<number[]>([]);
    useEffect(() => {
        if (profile?.avatar) {
            setAvatar([profile.avatar]);
        }
    }, [profile]);
    const edit = (id: number, token: string) => {
        if (avatar.length == 0) {
            alert("请选择图片");
            return
        }
        fetch(BASE_URL + `/api/my/avatar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                JWT_TOKEN: token
            },
            body: JSON.stringify({avatar: avatar[0]}),
        }).then(res => {if (res.status !== 200) { res.text().then(s => console.error(s))} else { getItemAsync("PROFILE").then(v => {
            if (!v) {
                navigation.navigate("Signin");
                return
            }
            const p = JSON.parse(v);
            p.avatar = avatar[0];
            setItemAsync("PROFILE", JSON.stringify(p)).then(() => {
                navigation.navigate("LocationList");
                return
            }).catch(e => console.error(e));

        }).catch(e => console.error(e))}}).catch(e => console.error(e));
    }

    const logout = () => {
        deleteItemAsync("PROFILE").then(() => {
            navigation.navigate("Signin");
        }).catch(e => console.error(e));
    }

    return profile 
    ? 
    <WithNavigation current="me" navigation={navigation} profile={profile}>
        <Upload ids={avatar} setIDs={setAvatar} headers={{"JWT_TOKEN": profile.token}}/>
        <Button title="修改" onPress={() => {edit(profile?.id, profile.token)}} />
        <Button title="退出" onPress={logout} />
    </WithNavigation> 
    : 
    <ActivityIndicator animating={true} />
}
import { useState } from "react";
import {View, Button, Text} from "react-native";
import { useProfile } from "../hooks/profile";
import { Upload } from "../components/upload";
import { BASE_URL } from "@env";

const Profile = ({navigation, route}: {navigation: any, route: any}) => {
    return <View>
        <Text>This is profile</Text>
        <Button title="Back to home" onPress={() => {navigation.navigate("Home");}} />
    </View>
}

export default Profile;

export const Edit = ({navigation, route}: {navigation: any, route: any}) => {
    const profile = useProfile();
    const [avatar, setAvatar] = useState<number[]>([])
    const edit = (id: number, token: string) => {
        fetch(BASE_URL + `/api/user/${id}`, {
            headers: {
                "Content-Type": "application/json",
                JWT_TOKEN: token
            },
        })
    }
    return <view>
        <Upload ids={avatar} setIDs={setAvatar}/>
    </view>
}
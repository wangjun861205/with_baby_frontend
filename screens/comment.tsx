import { ActivityIndicator, ViewProps } from "react-native";
import { Upsert as UpsertComment, List as CommentList, Comment } from "../components/comment";
import { WithNavigation } from "../components/navigation";
import { useProfile } from "../hooks/profile";
import { useEffect, useState} from "react";
import { BASE_URL } from "@env";

export const Upsert = ({navigation, route}: {navigation: any, route: any}) => {
    const profile = useProfile();
    return profile
    ? <WithNavigation current="locations" navigation={navigation} token={profile.token} username={profile.name} avatar={profile.avatar}> 
    <UpsertComment navigation={navigation} location_id={route.params.location_id} token={profile.token} />
    </WithNavigation>
    : <ActivityIndicator animating={true} />

}

interface ListProps extends ViewProps {
    navigation: any,
    route: any,
}


export const List = ({navigation, route}: ListProps) => {
    const [data, setData] = useState<(Comment & { id: number})[]>();
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const profile = useProfile();
    let isMounted = true;
    useEffect(() => {
        if (profile === undefined) {
            return () => {
                isMounted = false;
            };
        }
        if (profile === null) {
            navigation.navigate("Signin", {from: "CommentList", params: route.params})
            return () => {
                isMounted = false;
            }
        }
        const params = new URLSearchParams();
        params.append("limit", limit.toString());
        params.append("offset", offset.toString());
        fetch(BASE_URL + `/api/locations/${route.params.location_id}/comments?${params}`, {headers: {JWT_TOKEN: profile.token}}).then(
            res => {
                if (res.status !== 200) {
                    if (res.status === 403) {
                        navigation.navigate("Signin", {from: "CommentList", params: route.params});
                        return
                    }
                    res.text().then(s => console.error(s)).catch(e => console.error(e));
                    return
                }
                res.json().then(d => {
                    console.log(d);
                    if (isMounted) {
                        setData(d.list);
                    }
                });
            }
        ).catch(e => console.error(e));
        return () => {
            isMounted = false;
        }
    }, [profile])

    return profile && data
    ? <WithNavigation current="locations" navigation={navigation} token={profile.token} username={profile.name} avatar={profile.avatar} >
        <CommentList comments={data} onPress={() => {}} />
    </WithNavigation>
    : <ActivityIndicator animating={true} />
}
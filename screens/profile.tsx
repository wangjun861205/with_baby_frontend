import {Button, Text} from "react-native";

const Profile = ({navigation, route}: {navigation: any, route: any}) => {
    return <>
        <Text>This is {route.params.name}profile</Text>
        <Button title="Back to home" onPress={() => {navigation.navigate("Home");}} />
    </>
}

export default Profile;
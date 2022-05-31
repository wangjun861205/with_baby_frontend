import {View, Button, Text} from "react-native";

const Profile = ({navigation, route}: {navigation: any, route: any}) => {
    return <View>
        <Text>This is profile</Text>
        <Button title="Back to home" onPress={() => {navigation.navigate("Home");}} />
    </View>
}

export default Profile;
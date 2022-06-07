import useAsync from "../hooks/async";
import { createEating } from "../apis/eating";
import { View, TextInput, Button } from "react-native";
import { useState } from "react";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";


export const Create = ({navigation, route}: {navigation: any, route: any}) => {
	const [name, setName] = useState("");
	const [images, setImages] = useState<string[]>([]);
	const {execute, res, err, stat} = useAsync(async () => {
		return createEating(name, images);
	});
	return <View>
		<TextInput placeholder="名称..." onChangeText={(t) => setName(t)}></TextInput>
		<Button title="拍摄" onPress={navigation.navigate("Photo", {addImage: (p: string) => {setImages((old) => {old.push(p); return old})}})} />
	</View>
}
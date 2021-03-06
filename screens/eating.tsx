import useAsync from "../hooks/async";
import { createEating } from "../apis/eating";
import { View, TextInput, Button } from "react-native";
import { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Upload } from "../components/upload";


export const EatingCreate = ({ navigation, route }: { navigation: any, route: any }) => {
	const [name, setName] = useState("");
	const [images, setImages] = useState<number[]>([]);
	useEffect(() => {
		console.log(images);
	}, [images])
	return <View>
		<TextInput placeholder="名称..." onChangeText={(t) => setName(t)}></TextInput>
		<Upload setIDs={setImages}/>
	</View>
}
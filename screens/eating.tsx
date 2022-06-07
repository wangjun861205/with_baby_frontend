import useAsync from "../hooks/async";
import { createEating } from "../apis/eating";
import { View, TextInput } from "react-native";
import { useState } from "react";


export const Create = () => {
	const [name, setName] = useState("");
	return <View>
		<TextInput placeholder="名称..." onChangeText={(t) => setName(t)}></TextInput>
	</View>
}
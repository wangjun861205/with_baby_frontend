import { View, TextInput, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { getLocation } from "../utils/location";
import { getJWTToken } from "../utils/jwt";
import { Upload } from "../components/upload";

type CreateLocationRequest = {
	name: string,
	latitude: number,
	longitude: number,
	category: number,
	description: string,
	images: number[],
}

export const CreateLocation = () => {
	const [req, setReq] = useState<CreateLocationRequest>({ name: "", latitude: 0, longitude: 0, category: 0, description: "", images: [] });


	const create = async () => {
		try {
			const loc = await getLocation();
			const token = await getJWTToken();
			setReq(old => ({
				...old,
				latitude: loc.coords.latitude,
				longitude: loc.coords.longitude,

			}));

		} catch (e) {
			console.error(e);
		}

	};

	return <View>
		<TextInput placeholder="名称" onChangeText={s => setReq(old => {
			return {
				...old,
				name: s,
			}
		})} />
		<Picker selectedValue={req.category} onValueChange={v => setReq(old => {
			return {
				...old,
				category: v,
			}
		})} >
			<Picker.Item value={1} label="吃" />
			<Picker.Item value={2} label="玩" />
			<Picker.Item value={4} label="吃 + 玩" />

		</Picker>
		<TextInput multiline={true} numberOfLines={10} onTextInput={v => setReq(old => {
			return {
				...old,
				description: v,
			}
		})} />
		<Upload
			<Button title="创建" onPress={() => {
				getLocation().then(loc => {

				})
			}} />

	</View>

}
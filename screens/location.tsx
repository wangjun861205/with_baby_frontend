import { View, TextInput, Button, ScrollView, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { getLocation } from "../utils/location";
import { getJWTToken } from "../utils/jwt";
import { Upload } from "../components/upload";
import { BASE_URL } from "@env";
import { nearbyLocation } from "../apis/location";

type CreateLocationRequest = {
	name: string,
	latitude: number,
	longitude: number,
	category: number,
	description: string,
}

export const CreateLocation = () => {
	const [req, setReq] = useState<CreateLocationRequest>({ name: "", latitude: 0, longitude: 0, category: 0, description: "" });
	const [imgs, setImgs] = useState<number[]>([]);

	const create = async () => {
		try {
			const loc = await getLocation();
			const token = await getJWTToken();
			setReq(old => ({
				...old,
				latitude: loc.coords.latitude,
				longitude: loc.coords.longitude,

			}));
			const res = await fetch(BASE_URL + "/api/locations/", {
				method: "post",
				headers: {
					"Content-Type": "application/json",
					"JWT_TOKEN": token,
				},
				body: JSON.stringify({ ...req, images: imgs })
			});
			if (res.status !== 200) {
				console.error(res.status);
			}
			return res.json()
		} catch (e) {
			console.error(e);
		}

	};

	return <ScrollView keyboardShouldPersistTaps="handled">

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
		<TextInput placeholder="描述" multiline={true} numberOfLines={10} onChangeText={v => setReq(old => ({
			...old,
			description: v,
		}))} />
		<Upload setIDs={setImgs} />
		<Button style={styles.button} title="创建" onPress={() => {
			create().then(id => console.log(id)).catch(res => alert(res));
		}} ></Button>

	</ScrollView>
}

type Location =  {
	name: string
	latitude: number,
	longitude: number,
	description: string,
	images: {
		id: number,
		fetch_code: string
	}[]
}

export const LocationList = () => {
	const [locs, setLocs] = useState<Location[]>([]);
	const [limit, setLimit] = useState(10);
	const [offset, setOffset] = useState(0);
	useEffect(() => {
		nearbyLocation(limit, offset).then(res => setLocs(res.list)).catch(reason => console.error(reason))
	}, [limit, offset]);
	return <View>
		<ScrollView>
			{
				locs.map(l => (
					<View>
						<Text>{l.name}</Text>
						<Text>{l.description}</Text>
						<View>
						</View>
					</View>
				))
			}
		</ScrollView>
	</View>
	

	

}


const styles = StyleSheet.create({
	"flex-grow": {
		flexGrow: 1,
	},
	button: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
	}
})
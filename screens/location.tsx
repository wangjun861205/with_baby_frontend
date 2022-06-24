import { View, Image, TextInput, Button, ScrollView, StyleSheet, Text, ViewProps, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { getLocation } from "../utils/location";
import { getJWTToken } from "../utils/jwt";
import { Upload } from "../components/upload";
import { BASE_URL } from "@env";
import { nearbyLocation, detail } from "../apis/location";

type CreateLocationRequest = {
	name: string,
	latitude: number,
	longitude: number,
	category: number,
	description: string,
}

interface CreateLocationProps extends ViewProps {
	navigation: any
}

export const CreateLocation = ({ navigation }: CreateLocationProps) => {
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
		<Upload ids={imgs} setIDs={setImgs} />
		<Button style={styles.button} title="创建" onPress={() => {
			create().then(id => console.log(id)).catch(res => alert(res));
		}} ></Button>

	</ScrollView>
}


type Location = {
	id: number,
	name: string
	latitude: number,
	longitude: number,
	description: string,
	images: {
		id: number,
		fetch_code: string
	}[]
}

interface LocationListProps extends ViewProps {
	navigation: any
}



export const LocationList = ({ navigation }: LocationListProps) => {
	const [locs, setLocs] = useState<Location[]>([]);
	const [limit, setLimit] = useState(10);
	const [offset, setOffset] = useState(0);
	const [token, setToken] = useState<string>("");
	let isMounted = true;
	useEffect(() => {
		getJWTToken().then(t => {
			setToken(t);
			console.log(token);
			nearbyLocation(limit, offset).then(res => { console.log(res.list); if (isMounted) { setLocs(res.list); } }).catch(reason => console.error(reason));
		});
		return () => {
			isMounted = false;
		}
	}, [limit, offset]);
	return <View>
		<ScrollView>
			{
				locs.map(l =>
					<View key={l.id}>
						<Text>{l.name}</Text>
						<Text>{l.description}</Text>
						<Text>{l.latitude}</Text>
						<Text>{l.longitude}</Text>
						<View>
							{
								l.images.map(img => (<Image key={img.id} style={{ width: 100, height: 100 }} source={{ uri: BASE_URL + `/api/upload/${img.id}`, headers: { JWT_TOKEN: token } }} />))
							}
						</View>
						<Button title="编辑" onPress={() => { navigation.navigate("EditLocation", { id: l.id }) }} />
					</View>)
			}
		</ScrollView>
	</View>

}

type EditLocationState = {
	id: number,
	name: string,
	category: number,
	description: string,
	images: { id: number }[]
}

interface EditLocationProps extends ViewProps {
	navigation: any,
	route: any,
}

export const EditLocation = ({ route }: EditLocationProps) => {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState<EditLocationState | null>(null);
	const [images, setImages] = useState<number[]>([]);
	let isMounted = true;
	useEffect(() => {
		detail(route.params.id).then(res => { if (isMounted) { setData(res); setIsLoading(false); } }).catch(e => console.error(e));
		return () => {
			isMounted = false;
		}
	}, [])
	return isLoading ? <ActivityIndicator animating={true} size="large" hidesWhenStopped={true} /> : <View>
		<ScrollView keyboardShouldPersistTaps="handled">
			<TextInput placeholder="名称" value={data?.name} />
			<Picker selectedValue={data?.category} onValueChange={(v) => {
				setData(old => ({ ...old!, category: v }));
			}} >
				<Picker.Item value={1} label="吃" />
				<Picker.Item value={2} label="玩" />
				<Picker.Item value={4} label="吃 + 玩" />
			</Picker>
			<TextInput placeholder="描述" value={data?.description} onChangeText={v => setData(old => ({ ...old!, description: v }))} />
			<Upload ids={images} setIDs={setImages} />
		</ScrollView>
	</View >
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

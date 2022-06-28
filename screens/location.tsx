import { View, Image, TextInput, Button, ScrollView, StyleSheet, Text, ViewProps, ActivityIndicator, TouchableOpacity, NativeSyntheticEvent } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { getLocation } from "../utils/location";
import { getJWTToken } from "../utils/jwt";
import { Upload } from "../components/upload";
import { BASE_URL } from "@env";
import { nearbyLocation, detail, update } from "../apis/location";
import { WithNavigation } from "../components/navigation";
import { useIsFocused } from "@react-navigation/native"
import { MyImage } from "../components/image";
import { useCoords } from "../hooks/location";
import { useProfile } from "../hooks/profile"



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


type Location = [
	{
	id: number,
	name: string
	category: number,
	latitude: number,
	longitude: number,
	description: string,
	},
	{
		id: number,
		name: string,
	},
	{
		id: number,
		name: string,
		is_required: boolean,
		usage: string
	}[],
	{
		id: number,
		fetch_code: string
	}[],
	number[]
]

interface LocationListProps extends ViewProps {
	navigation: any
}




export const LocationList = ({ navigation }: LocationListProps) => {
	const [locs, setLocs] = useState<Location[]>([]);
	const [limit, setLimit] = useState(10);
	const [offset, setOffset] = useState(0);
	const coords = useCoords();
	const profile = useProfile();
	const isFocuse = useIsFocused();
	let isMounted = true;
	useEffect(() => {
		if (profile === null) {
			navigation.navigate("Signin", {from: "LocationList"});
			return;
		}
		if (!profile || !coords) {
			return;
		}
		nearbyLocation(profile.token, coords.latitude, coords.longitude, limit, offset).then(res => {  if (isMounted) { setLocs(res.list); } }).catch(reason => console.error(reason));
		return () => {
			isMounted = false;
		}
	}, [limit, offset, isFocuse, profile, coords]);
	return !coords || !profile || !locs ?  <ActivityIndicator animating={true} /> :
		<WithNavigation current="locations" navigation={navigation} token={profile.token} username={profile.name} avatar={profile.avatar}>
		<View>
			{
				locs.map(l =>
					<TouchableOpacity key={l[0].id} onPress={() => {navigation.navigate("LocationDetail", {"id": l[0].id})}}>
						<View>
							<View style={styles.row}>
								<Text>{l[0].name}</Text>
								<Text>{l[0].description}</Text>
								<Text>由{l[1].name}发现</Text>
								<Text>距离:{l[4]}</Text>
								{
									l[3].map(img => (<Image key={img.id} style={{ width: 100, height: 100 }} source={{ uri: BASE_URL + `/api/upload/${img.id}`, headers: { JWT_TOKEN: profile.token } }} />))
								}
							</View>
							<View style={styles.row}>
								<Button title="编辑" onPress={() => { navigation.navigate("EditLocation", { id: l[0].id }) }} />
								<Button title="添加回忆" onPress={() => { navigation.navigate("CreateMemory", { locationID: l[0].id }) }} />
								<Button title="回忆" onPress={() => { navigation.navigate("MemoryList", { locationID: l[0].id }) }} />
							</View>
						</View>
					</TouchableOpacity>)
			}
		</View>
	</WithNavigation>
}


interface EditLocationProps extends ViewProps {
	navigation: any,
	route: any,
}

export const Edit = ({ navigation, route }: EditLocationProps) => {
	const [data, setData] = useState<Location>();
	const [images, setImages] = useState<number[]>([]);
	const token = useToken();
	const coords = useCoords();
	let isMounted = true;
	useEffect(() => {
		const ids = data ? data[3].map((v: {id: number}) => v.id) : [];
		console.log(ids);
		if (isMounted) {
			setImages(ids);
		}
	}, [data])
	useEffect(() => {
		if (token === null) {
			navigation.navigate("Signin", {from: "EditLocation"});
			return
		}
		if (!token || !coords) {
			return
		}
		detail(route.params.id, token, coords?.latitude, coords.longitude).then(res => { 
			if (isMounted) { 
				setData(res); 
			} 
		}).catch(e => console.error(e));
		return () => {
			isMounted = false;
		}
	}, [token, coords])
	return <WithNavigation current="locations" navigation={navigation}>
		{
			!data ? <View style={styles.indicator}><ActivityIndicator  animating={true} size="large" hidesWhenStopped={true} /></View>: <View>
				<ScrollView keyboardShouldPersistTaps="handled">
					<TextInput placeholder="名称" value={data[0].name} onChangeText={(v) => setData(old => ({...old!, name: v}))}/>
					<Picker selectedValue={data[0].category} onValueChange={(v) => {
						setData(old => ({ ...old!, category: v }));
					}} >
						<Picker.Item value={1} label="吃" />
						<Picker.Item value={2} label="玩" />
						<Picker.Item value={4} label="吃 + 玩" />
					</Picker>
					<TextInput placeholder="描述" value={data[0].description} onChangeText={v => setData(old => ({ ...old!, description: v }))} />
					{ token && images ? <Upload ids={images} setIDs={setImages} headers={{"JWT_TOKEN": token}}/> : <></> }
					<Button title="修改" disabled={!data} onPress={() => {
						const body = {
							name: data[0].name, 
							category: data[0].category,
							description: data[0].description,
							images: images};
						update(route.params.id, body);}} />
				</ScrollView>
			</View >
		}
	</WithNavigation>
}

interface DetailProps extends ViewProps {
	navigation: any,
	route: any,
}

export const Detail = ({navigation, route}: DetailProps) => {
	const token = useToken();
	const coords = useCoords();
	const [data, setData] = useState<Location>();
	let isMounted = true;

	useEffect(() => {
		if (token === null) {
			navigation.navigate("Signin", {from: "LocationDetail"});
			return
		}
		if (!token || !coords) {
			return
		}
		detail(route.params.id, token, coords.latitude, coords.longitude).then(res => { if (isMounted) { setData(res) }}).catch(e => { setStatus("Error"); console.error(e)});
		return () => {
			isMounted = false;
		}
	}, [token, coords]);

	return !data ? <ActivityIndicator animating={true} /> : 
		<WithNavigation current="locations" navigation={navigation}>
			<Text>{data[0].name}</Text>
			<Text>{data[0].description}</Text>
			<Text>{ data[0].category === 1 ? "吃" : data[0].category === 2 ? "玩" : "吃 + 玩" }</Text>
			{
				data[3].map(img => <MyImage key={img.id} id={img.id} width="100%" height={300}/>)
			}
		</WithNavigation>
}



const styles = StyleSheet.create({
	"flex-grow": {
		flexGrow: 1,
	},
	button: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
	row: {
		flexWrap: "wrap",
		flexDirection: "row",
		width: "100%",
		justifyContent: "space-around",
		alignItems: "center",
	},
	indicator: {
		position: "absolute",
		top: 200,
		width: "100%"
	},

})


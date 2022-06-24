import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signin from "./screens/signin";
import Home from './screens/home';
import Profile from './screens/profile';
import { PlayingList, PlayingCreate } from "./screens/playing"
import * as Location from "expo-location";
import { Photo } from "./screens/photo";
import { EatingCreate } from './screens/eating';
import { CreateLocation, LocationList, EditLocation } from './screens/location';



const Stack = createNativeStackNavigator();

export default function App() {
  Location.requestForegroundPermissionsAsync().then(res => { console.log(res) }).catch(err => alert(err));
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="PlayingList" component={PlayingList} />
        <Stack.Screen name="PlayingCreate" component={PlayingCreate} />
        <Stack.Screen name="Photo" component={Photo} />
        <Stack.Screen name="EatingCreate" component={EatingCreate} />
        <Stack.Screen name="CreateLocation" component={CreateLocation} />
        <Stack.Screen name="LocationList" component={LocationList} />
        <Stack.Screen name="EditLocation" component={EditLocation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

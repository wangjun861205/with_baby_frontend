import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signin from "./screens/signin";
import Home from './screens/home';
import Profile from './screens/profile';
import { PlayingList, PlayingCreate } from "./screens/playing"


export const BASE_URL = "http://192.168.3.11:8000";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="PlayingList" component={PlayingList} />
        <Stack.Screen name="PlayingCreate" component={PlayingCreate} />
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

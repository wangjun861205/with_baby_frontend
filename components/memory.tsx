import {ViewProps, View, TouchableOpacity, Text, StyleSheet} from "react-native";
import { Memory, Location, Upload } from "../models/models";


interface ListProps extends ViewProps {
    list: Array<[Memory, Location, Upload[], number]>,
    onPress : (id: number) => void,

}
export const List = ({list, onPress}: ListProps) => {
    return <View>
        {
            list.map(v => {
                return <TouchableOpacity key={v[0].id} style={styles.row} onPress={() => onPress(v[0].id)}>
                    <Text>{v[0].title}</Text>
                    <Text>{v[0].content}</Text>
                    <Text>{v[1].name}</Text>
                </TouchableOpacity>
            })
        }
    </View>
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-around",
    }
})
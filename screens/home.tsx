import { Text, Button, StyleSheet, View } from 'react-native';

const Home = ({navigation}: { navigation: any }) => {
    return <>
        <View style={[styles.textContainer, styles.yellow]}>
            <Text style={styles.text}>玩</Text>
        </View>
        <View style={[styles.textContainer, styles.cyan]}>
            <Text style={styles.text}>吃</Text>
        </View>
    </>
}


const styles = StyleSheet.create({
    textContainer: {
        justifyContent: "center",
        marginLeft: "auto",
        marginRight: "auto",
        width: "100%",
        height: "50%",
    },
    yellow: {
        backgroundColor: "#ffff00",
    },
    cyan: {
        backgroundColor: "#00ffff",
    },
    text: {
        textAlign: "center",
        fontSize: 30,
    }

})

export default Home;
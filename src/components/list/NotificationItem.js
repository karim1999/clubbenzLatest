import React from "react";
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native";

export default class NotificationItem extends React.Component {
    getDate(date){
        let parts= date.split(" ");
        let firstPart= parts[0].split("-");
        let secondPart= parts[1].split(":");
        let time= new Date(firstPart[0], firstPart[1], firstPart[2], secondPart[0], secondPart[1])
        // return firstPart[0]+ " " +firstPart[1]+ " " +firstPart[2]+ " " +secondPart[0]+ " " +secondPart[1]+ " " +secondPart[2];
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = firstPart[0]+ "/" +firstPart[1]+ "/" +firstPart[2]+ "\n"+hours + ':' + minutes + ' ' + ampm;
        return strTime;
        // return time.getHours();
    }

    render(){
        return (
            <TouchableOpacity onPress={this.props.onPress} style={styles.container}>
                {
                    this.props.pic ?
                    <View style={styles.imgContainer}>
                        <Image style={styles.img} source={{uri: this.props.pic}} />
                    </View> : null
                }
                <View style={styles.dataContainer}>
                    <View style={styles.firstRow}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{this.props.title}</Text>
                        </View>
                        <View style={styles.dateContainer}>
                            <Text style={styles.date}>{this.getDate(this.props.date)}</Text>
                        </View>
                    </View>
                    <View style={styles.secondRow}>
                        <Text style={styles.description}>{this.props.details}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: 80,
        flexDirection: "row",
        margin: 15,
        borderWidth: 3,
        borderColor: "white",
        backgroundColor: "white",
        borderRadius: 6

    },
    imgContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        marginBottom: 15,
        borderColor: "white",
    },
    img: {
        flex: 1,
        resizeMode: "contain",
        width: 70,
    },
    dataContainer: {
        flex: 4,
        flexDirection: "column",
        padding: 7
    },
    firstRow: {
        flex: 1,
        flexDirection: "row",
    },
    titleContainer: {
        flex: 3,
    },
    title: {
        fontWeight: "900",
        fontSize: 15
    },
    dateContainer: {
        flex: 2,
        alignItems: "flex-end"
    },
    date: {
        fontWeight: "bold",
        fontSize: 11,
        textAlign: "right"
    },

    secondRow: {
        flex: 1,
    },
    description: {
        fontWeight: "500",
        fontSize: 13
    },
});

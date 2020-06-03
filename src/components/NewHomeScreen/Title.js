import {Text, View, StyleSheet} from "react-native";
import React, {PureComponent} from "react";

class Title extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={Styles.container}>
                <Text style={Styles.side}>_______</Text>
                <Text style={Styles.title}>{this.props.title}</Text>
                <Text style={Styles.side}>_______</Text>
            </View>
        );
    }
}

export default Title;

let Styles= StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        textAlign: "center",
        flex: 1,
        fontSize: 26,
        color: "black",
        paddingTop: 20
    },
    side: {
        textAlign: "center",
        flex: 1,
        fontSize: 20,
        color: "grey"
    },
})

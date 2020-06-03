import {Text, View, StyleSheet, TouchableOpacity} from "react-native";
import React, {PureComponent} from "react";
import Icon from "react-native-vector-icons/FontAwesome";

class ShareButton extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} style={Styles.container}>
                <Icon style={Styles.icon} size={20} color="white" name={this.props.icon} />
                <Text style={Styles.title}>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }
}

export default ShareButton;

let Styles= StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 70,
        backgroundColor: "#060029",
        margin: 30
    },
    title: {
        textAlign: "center",
        fontSize: 17,
        color: "white",
    },
    icon: {
        padding : 10
    }
})

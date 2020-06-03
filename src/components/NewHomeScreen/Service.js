import {Text, View, StyleSheet, ImageBackground, TouchableOpacity} from "react-native";
import React, {PureComponent} from "react";

class Service extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ImageBackground style={Styles.container} source={this.props.image}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <Text style={Styles.title}>{this.props.title}</Text>
                </TouchableOpacity>
            </ImageBackground>
        );
    }
}

export default Service;

let Styles= StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        height: 150,
        padding: 10,
        marginTop: 20
    },
    title: {
        fontSize: 20,
        borderWidth: 1,
        borderColor: "white",
        color: "white",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
    }
})

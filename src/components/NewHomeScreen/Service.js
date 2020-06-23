import {Text, View, StyleSheet, ImageBackground, TouchableOpacity} from "react-native";
import React, {PureComponent} from "react";

class Service extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ImageBackground style={Styles.container} source={this.props.image}>
                <TouchableOpacity style={Styles.textContainer} onPress={this.props.onPress}>
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
        flexDirection: 'column',
        justifyContent: "flex-end",
        alignItems: "center",
        height: 150,
        marginTop: 20
    },
    textContainer: {
        backgroundColor: "rgba(255,255,255,0.39)",
        alignSelf: 'stretch',
        paddingVertical: 10
    },
    title: {
        fontSize: 20,
        color: "#0e2d3c",
        textAlign: 'center',
        fontWeight: 'bold'
    }
})

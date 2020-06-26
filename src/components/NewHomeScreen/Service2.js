import {Text, View, StyleSheet, ImageBackground, TouchableOpacity} from "react-native";
import React, {PureComponent} from "react";

class Service2 extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ImageBackground style={Styles.container} source={{uri: this.props.image}}>
                <TouchableOpacity style={Styles.textContainer} onPress={this.props.onPress}>
                    <Text style={Styles.title}>{this.props.title}</Text>
                </TouchableOpacity>
                {
                    this.props.disable &&
                    <View style={Styles.filter}></View>
                }
            </ImageBackground>
        );
    }
}

export default Service2;

let Styles= StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-end",
        alignItems: "center",
        height: 150,
        margin: 5,
    },
    filter: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.47)'
    },
    textContainer: {
        backgroundColor: "rgba(255,255,255,0.39)",
        alignSelf: 'stretch',
        paddingVertical: 10
    },
    title: {
        fontSize: 16,
        color: "#0e2d3c",
        textAlign: 'center',
        fontWeight: 'bold'
    }
})

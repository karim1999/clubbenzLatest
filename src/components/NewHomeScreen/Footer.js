import {Text, View, StyleSheet, ImageBackground, TouchableOpacity} from "react-native";
import React, {PureComponent} from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import __ from "../../resources/copy";
import MyCardScreen from '../../containers/MyCardScreen';

class Footer extends PureComponent {
    constructor(props) {
        super(props);
    }

    navigate(screen, params){
        this.props.navigation.navigate(screen, { fromSlideMenu: true, ...params });
    }

    render() {
        return (
            <ImageBackground
                resizeMode= 'stretch'
                source={require("./../../resources/images/footer.png")} style={Styles.footer}
            >
                {/*<TouchableOpacity onPress={this.navigate.bind(this, "HomeScreen")} style={Styles.iconContainer}>*/}
                {/*    <Icon name="home" size={22} color="#ffffff" />*/}
                {/*    <Text style={Styles.text}>{__('Home')}</Text>*/}
                {/*</TouchableOpacity>*/}
                <TouchableOpacity onPress={this.navigate.bind(this, "MyCardScreen", {card: true})} style={Styles.iconContainer}>
                    <Icon name="id-card" size={22} color="#ffffff" />
                    <Text style={Styles.text}>{__('My Card')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.navigate.bind(this, "MembershipsScreen", {})} style={Styles.iconContainer}>
                    <Icon name="money" size={22} color="#ffffff" />
                    <Text style={Styles.text}>{__('Memberships')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.navigate.bind(this, "MyProfileScreen", {})} style={Styles.iconContainer}>
                    <Icon name="cog" size={22} color="#ffffff" />
                    <Text style={Styles.text}>{__('My Profile')}</Text>
                </TouchableOpacity>
            </ImageBackground>
        );
    }
}

export default Footer;

let Styles= StyleSheet.create({
    footer: {
        minHeight: 80,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingBottom: 10
    },
    iconContainer: {
        flex: 1,
        textAlign: 'center',
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "white"
    }
})

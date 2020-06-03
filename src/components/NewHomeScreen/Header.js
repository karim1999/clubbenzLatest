import {Text, View, StyleSheet, ImageBackground, Image, TextInput, TouchableWithoutFeedback} from "react-native";
import React, {PureComponent} from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import __ from "../../resources/copy";

class Header extends PureComponent {
    constructor(props) {
        super(props);
        this.onSlidePress= this.onSlidePress.bind(this)
        this.onNotificationIconPress= this.onNotificationIconPress.bind(this)
        this.goBack= this.goBack.bind(this)
        this.state={
            text: ""
        }
    }
    goBack(){
        this.props.navigation.goBack();
    };
    onSlidePress(){
        this.props.navigation.openDrawer();
    };
    onNotificationIconPress(){
        this.props.navigation.navigate('NotificationScreen');
    };
    render() {
        return (
            <ImageBackground
                resizeMode= 'stretch'
                source={require("./../../resources/images/header.png")} style={Styles.nav}>
                <View style={Styles.navContent}>
                    {
                        this.props.goBack ?
                            <Icon onPress={this.goBack} size={23} color={"#FFFFFF"} name="chevron-left"/>
                            :
                            <Icon onPress={this.onSlidePress} size={23} color={"#FFFFFF"} name="bars"/>
                    }
                    <View style={Styles.navMiddle}>
                        {
                            this.props.title ?
                                <Text style={Styles.title}>{this.props.title}</Text>
                                :
                                <Image style={Styles.logo} source={require("./../../resources/images/benz_logo.png")} />
                        }
                        <View style={Styles.inputContainer}>
                            <View styles={Styles.inputIcon}>
                                <Icon size={16} color={"#FFFFFF"} name="search"/>
                            </View>
                            <TextInput
                                onChangeText={(text)=>this.setState({text:text})}
                                onSubmitEditing={()=> {
                                    if(this.props.onSearch){
                                        this.props.onSearch(this.state.text)
                                    }
                                }}
                                placeholderTextColor="white" style={Styles.searchInput} placeholder={this.props.placeholder || __("FIND A SERVICE PROVIDER")}  />
                        </View>
                    </View>
                    {
                        this.props.homeButton ?
                            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Home')}>
                                <Image
                                    style={{height:27,width:27, alignItems: 'center', justifyContent: 'center'}}
                                    resizeMode="contain"
                                    source={require('../../resources/images/white-logo.png')}
                                />
                            </TouchableWithoutFeedback>
                            :
                            <Icon onPress={this.onNotificationIconPress} size={23} color={"#FFFFFF"} name="bell-o"/>
                    }
                </View>
            </ImageBackground>
        );
    }
}

export default Header;

let Styles= StyleSheet.create({
    nav: {
        minHeight: 120,
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 2
    },
    navContent: {
        padding: 10,
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        zIndex: 2
    },
    navMiddle: {
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        width: 130,
        height: 40,
        resizeMode: "stretch"
    },
    title: {
        color: "#ffffff",
        fontSize: 23
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        color: "white",
        borderBottomWidth: 1,
        borderBottomColor: "white",
        textAlign: "right",
        minWidth: 170,
    },
    inputIcon: {
        position: "absolute",
    },
})

import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    Image,
    TextInput,
    TouchableWithoutFeedback,
    I18nManager,
    Platform,
} from 'react-native';
import React, {PureComponent} from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import __ from "../../resources/copy";
import {bindActionCreators} from 'redux';
import * as authAction from '../../redux/actions/auth';
import {connect} from 'react-redux';

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
                source={require("./../../resources/images/header.png")} style={[Styles.nav, {minHeight: this.props.noSearch ? 80 : 120}]}>
                <View style={Styles.navContent}>
                    <View style={[Styles.navMiddle, {alignItems: 'flex-start'}]}>

                    {
                        this.props.goBack ?
                            <TouchableWithoutFeedback onPress={this.goBack}>
                                <Image
                                    style={{height:27,width:27, alignItems: 'center', justifyContent: 'center', transform: [{scaleX: I18nManager.isRTL ? -1 : 1}] }}
                                    resizeMode="contain"
                                    source={require('../../resources/images/ic-back.png')}
                                />
                            </TouchableWithoutFeedback>
                            :
                            <Icon onPress={this.onSlidePress} size={23} color={"#FFFFFF"} name="bars"/>
                    }
                    </View>
                    <View style={[Styles.navMiddle, {flex: 2}]}>
                        {
                            this.props.title ?
                                <Text style={Styles.title}>{this.props.title}</Text>
                                :
                                <Image style={Styles.logo} source={require("./../../resources/images/benz_logo.png")} />
                        }
                        {
                            !this.props.noSearch &&
                            <View style={[Styles.inputContainer, this.props.language.isArabic ? {flexDirection: "row-reverse"} : {}]}>
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
                        }
                    </View>

                    <View style={[Styles.navMiddle, {alignItems: 'flex-end'}]}>
                        {
                            this.props.onMapPress &&
                            <TouchableWithoutFeedback onPress={this.props.onMapPress}>
                                <View>
                                    <Image
                                        style={{height: 32, width: 32, alignItems: 'center', justifyContent: 'center',}}
                                        source={require('../../resources/icons/ic_mapview.png')}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        }
                        {
                            this.props.homeButton &&
                            <Icon onPress={() => this.props.navigation.navigate('Home')} size={23} color={"#FFFFFF"} name="home"/>
                        }
                        {
                            this.props.notificationIcon &&
                            <Icon onPress={this.onNotificationIconPress} size={23} color={"#FFFFFF"} name="bell-o"/>
                        }

                    </View>
                </View>
            </ImageBackground>
        );
    }
}

mapStateToProps = (state) => {
    return {
        language: state.language,
    }
}

export default connect(mapStateToProps, null)(Header)

let Styles= StyleSheet.create({

    nav: {
      minHeight: (Platform.OS === 'ios') ? 120 : 120,
      paddingTop: (Platform.OS === 'ios') ? 30 : 0,
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
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        width: 140,
        height: 43,
        marginBottom: 10,
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
        alignSelf: "flex-start",
        minWidth: 170,
    },
    inputIcon: {
        position: "absolute",
    },
    leftContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

})

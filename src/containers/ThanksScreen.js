import React, { PureComponent } from 'react';
import { View, StyleSheet, StatusBar, Text, Image, TouchableOpacity } from 'react-native';

import { NavigationActions } from 'react-navigation';
import { styles, fonts, colors, metrics } from '../themes';
import NavigationService from '../NavigationService';
import NavigationComponent from '../components/navigation/navigation';
import {PROFILE_PIC_PREFIX} from './../config/constant';
import RoundedButton from '../components/common/RoundedButton';
import { Fonts } from '../resources/constants/Fonts';
import __ from '../resources/copy';
import { connect } from 'react-redux';
import { returnProfilePicture } from '../components/profile/ProfilePicture';
// console.log(this.props.navigation.state.params.user)
// debugger

class ThanksScreen extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        
        userName: this.props.navigation.state.params.user.username ? this.props.navigation.state.params.user.username : "No Name",
        userFirstName: this.props.navigation.state.params.user.first_name ? this.props.navigation.state.params.user.first_name : '',
        userLastName: this.props.navigation.state.params.user.last_name ? this.props.navigation.state.params.user.last_name : '',
        isBooking: this.props.navigation.state.params.isBooking ? this.props.navigation.state.params.isBooking : false,
        isSolution: this.props.navigation.state.params.isSolution ? this.props.navigation.state.params.isSolution : false,
    }

    onDonePress = () => {
        NavigationService.goBack();
    }

    render() {
        // const profile_picture = this.props.navigation.state.params.user.profile_picture!=''?{uri:PROFILE_PIC_PREFIX+this.props.navigation.state.params.user.profile_picture}:require('../resources/images/ic_menu_userplaceholder.png')
        // debugger
        const profile_picture = returnProfilePicture(this.props.navigation.state.params.user) != '' ? {uri: returnProfilePicture(this.props.navigation.state.params.user)} : require('../resources/images/ic_menu_userplaceholder.png');
        return (
            <View style={[styles.center, thanksScreenStyle.container]}>
                <StatusBar 
                    hidden={false}
                    backgroundColor={colors.navgationBar}
                />

                <Text style={[thanksScreenStyle.textStyle, { fontSize: 18, fontFamily: Fonts.CircularBook, }]}>{__('Thanks' , this.props.language)}</Text>
                <Text style={[thanksScreenStyle.textStyle,
                {
                    fontSize: 32,
                    marginBottom: 8,
                    fontFamily: Fonts.CircularBold,
                }]}>{this.state.userFirstName + ' ' + this.state.userLastName}</Text>

                <Image style={thanksScreenStyle.image}
                    source={profile_picture} />
                    
                <Text style={[thanksScreenStyle.textStyle,
                {
                    textAlign: "center",
                    marginTop: 12,
                    fontSize: 17,
                    fontFamily: Fonts.CircularMedium,
                }]}>
                {this.state.isBooking == true ? __('Your request sent successfully, our agent will call you shortly' , this.props.language) : (this.state.isSolution == true ? __('Your solution has been submitted successfully', this.props.language) : __('Your voice matters and helps other members' , this.props.language))}</Text>

                <TouchableOpacity style={[thanksScreenStyle.button, {fontFamily: Fonts.CircularMedium}]} onPress={this.onDonePress}>
                    <Text style={thanksScreenStyle.textStyle}>{__('Continue' , this.props.language)}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

mapStateToProps = (state) => {
	return {
		user: state.auth.user,
		language: state.language,
	}
  }
export default connect(mapStateToProps, null)(ThanksScreen)

const thanksScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#11455F",
        paddingHorizontal: 5
    },
    textStyle: {
        color: "white",
    },
    image: {
        width: metrics.deviceWidth * 0.28,
        height: metrics.deviceWidth * 0.28,
        borderRadius: metrics.deviceWidth * 0.14,
        borderWidth: 1,
        borderColor: "#006599"
    },
    button: {
        width: metrics.deviceWidth - 40,
        height: 55,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: colors.transparent,
        borderColor: colors.white,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: metrics.radius40,
        marginTop: 36,
    }
});

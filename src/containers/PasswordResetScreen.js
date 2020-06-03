import React, { Component } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, StatusBar, Dimensions, Image, ImageBackground,AsyncStorage } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { styles, fonts, colors, metrics } from '../themes';
import * as authAction from './../redux/actions/auth'
import { Fonts } from '../resources/constants/Fonts';
import NavigationComponent from '../components/navigation/navigation';
import __ from '../resources/copy'
import Toast from "react-native-simple-toast";
import { MOBILE_ERROR } from "../config/constant";

export default class PasswordResetScreen extends Component {
    constructor(props) {
		super(props);
    }
    
    render() {
		return (
			<View style={[styles.imageContain, styles.center, {backgroundColor: '#11445F'}]}>
			<StatusBar 
				hidden={false} 
                backgroundColor={colors.blueButton}
			/>

                    <Text style={[ResetStyle.heading1, {fontSize: 22}]}>{__('Reset', '')}</Text>
                    <Text style={[ResetStyle.heading2, {marginTop: 10, fontSize: 28}]}>{__('Password', '')}</Text>

                    <View style={ResetStyle.roundCircle}>

                    </View>

                    <Text style={[ResetStyle.heading1, {width: metrics.deviceWidth - 20, marginTop: 10, fontSize: 16}]}>{__('Successfully send Email with instructions', '')}{"\n"}{__('Please Follow Instructions', '')}</Text>

                    <TouchableOpacity style={[styles.tapableButtonHollow, {borderColor: '#FFFFFF', width: metrics.deviceWidth - 40, marginTop: 30,}]} onPress={() => this.props.navigation.navigate('LoginScreen')}>
                            <Text style={[styles.tapButtonStyleTextWhite, {fontFamily: Fonts.CircularBold, fontSize: 16}]}>{__('Back to login page', '')}</Text>
                    </TouchableOpacity>

                </View>
     
        );
        
    }
}

const ResetStyle=StyleSheet.create({
    heading1: {
        color: '#FFFFFF', fontFamily: Fonts.CircularMedium, fontSize: 17, textAlign: 'center',
    },

    heading2: {
        color: '#FFFFFF', fontFamily: Fonts.CircularBold, fontSize: 20, textAlign: 'center',
    },

    roundCircle: {
        marginTop: 10,
        width: metrics.deviceWidth / 3,
        height: metrics.deviceWidth / 3,
        borderRadius: metrics.deviceWidth / 2,
        backgroundColor: '#FFFFFF',
        // opacity: 0.12,
        opacity: 0,
    }
});
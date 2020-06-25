import React, { PureComponent } from 'react';
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

class ForgotPassScreen extends PureComponent {
	constructor(props) {
		super(props);
	}
	state={
        mobile: '',
		wrongPhone: false,
  }

    requestPasswordReset = () => {
        const phone = this.state.mobile;
        if (phone == '') {
					setTimeout(() => {
						Toast.show(MOBILE_ERROR, Toast.LONG);
					}, 100)
        } else {
            authAction.requestPasswordReset({ phone })
            .then(res => {
                if (res.success) {
									this.props.navigation.navigate('PasswordResetScreen')
                    // alert("A password reset link has been sent on your email. Please check your email!")
                } else {
									setTimeout(() => {
										Toast.show(res.message, Toast.LONG);
									 }, 100)
                }
            })
            .catch(err => {
                alert(JSON.stringify(err));
            });
        }
    }
	checkPhoneNumber(mobile) {
		this.setState({mobile});
		if (mobile.includes('+')) {
			this.setState({wrongPhone: false});
		} else {
			this.setState({wrongPhone: true});
		}
	}

	render() {
		return (
			<View style={[styles.imageContain, styles.center, {width: metrics.deviceWidth, height: metrics.deviceHeight, backgroundColor: '#0D2D3C'}]}>
			<StatusBar
					hidden={false}
					backgroundColor={colors.navgationBar}
			/>
				<View style={[styles.center]}>

					<Image style={{height: metrics.deviceWidth/3, width: metrics.deviceWidth/3,}} source={require('../resources/images/icon1.png')}/>

					<Text style={[styles.tapButtonStyleTextWhite, {marginTop: 20, fontSize: 20}]}>{__('Forget Password ?', '')}</Text>

					<Text style={[styles.tapButtonStyleTextWhite, {fontFamily: Fonts.CircularBold, marginTop: 40, width: metrics.deviceWidth - 5, fontSize: 16}]}>{__('We just need your registered mobile number to send you password reset instructions.', '')}</Text>
					{this.state.wrongPhone ? (
						<Text style={{color: 'red', textAlign: 'center'}}>
							{__('Please add country code (Ex: +201 2xx xxx xxx)', this.props.language)}
						</Text>
					) : null}

					<TextInput
						style={[styles.inputField, {borderColor: '#FFFFFF', width: metrics.deviceWidth - 20, marginTop: 30, color: '#FFFFFF'}]}
						textInputStyle={{ textAlign: "center", fontFamily: Fonts.CircularMedium, color: '#FFFFFF'}}
						keyboardType={'phone-pad'}
						returnKeyType='done'
						placeholder={__('Mobile Number', '')}
						placeholderTextColor='#627d8a'
						onChangeText={mobile => this.checkPhoneNumber(mobile)}
						value={this.state.mobile}
					/>

					<TouchableOpacity style={[styles.tapableButtonHollow, {borderColor: '#FFFFFF', marginTop: 40, width: metrics.deviceWidth - 40,}]} onPress={() => this.requestPasswordReset()}>
						<Text style={[styles.tapButtonStyleTextWhite, {fontFamily: Fonts.CircularBold, fontSize: 16}]}>{__('Reset Password', '')}</Text>
					</TouchableOpacity>

					<TouchableOpacity style={[styles.center, {marginTop: 40,}]} onPress={() => this.props.navigation.goBack()}>
						<Text style={{color: '#627d8a', fontFamily: Fonts.CircularBold, fontSize: fonts.size.h13}}>{__('Back', '')}</Text>
					</TouchableOpacity>

				</View>


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

  mapDispatchToProps = (dispatch) => bindActionCreators(
    {
		updateUser:authAction.updateUser
    },
    dispatch
  );

export default connect(mapStateToProps, null)(ForgotPassScreen)

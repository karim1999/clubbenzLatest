import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	StatusBar,
	Switch,
	Text,
	TouchableOpacity,
	Dimensions,
	Image,
	ImageBackground,
	ScrollView
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import { styles, fonts, colors, metrics } from '../themes';
const { width, height } = Dimensions.get('window');
import NavigationService from '../NavigationService';
import { Fonts } from '../resources/constants/Fonts';
import { connect } from 'react-redux';
import __ from '../resources/copy'

import { bindActionCreators } from 'redux';

import { UPDATE_USER, UPDATE_SELECTED_CAR, UPDATE_LANGUAGE } from "../redux/actions/types";

import { store } from "../redux/create"

import { setLanguage } from '../redux/actions/language';

import SimpleToast from 'react-native-simple-toast';

import { updateProfile } from "../redux/actions/auth";

import * as authAction from '../redux/actions/auth'

import { returnProfilePicture, returnProfilePictureWithoutPrefix } from '../components/profile/ProfilePicture';

const navigationOptions = {
	header: null,
};

class EnableNotificationScreen extends Component {
	constructor(props) {
		super(props);
		this.state={
			isNotificationEnable:false,
			isLocationEnable:false
		}
	}

	callUpdateApi = () => {
		const { user } = this.props;
		const profile_picture = returnProfilePicture(user);
		// debugger
		const data = {
			last_name: user.last_name,
			first_name: user.first_name,
			email: user.email,
			// password: user.password,
			mobile: user.phone,
			token: user.token,
			profile_picture: profile_picture,
			enablePushNotification: this.state.isNotificationEnable,
			enableLocation: this.state.isLocationEnable,
			enableFacebook: false,
			car_vin_prefix: user.car_vin_prefix,
			model_id: user.model_id,
			car_type_id: user.car_type_id,	
			year_id: user.year_id,
		}
		// debugger
		updateProfile(data)
			.then((res) => {
				// debugger
				if (res.success) {
					// Alert.alert('Info', 'Profile Updated Successfully')
					SimpleToast.show('Location & Notification status updated successfully', SimpleToast.LONG)
					this.props.navigation.reset([NavigationActions.navigate({ routeName: 'HomeScreen' })], 0)
				}
				
				console.log(res)
				
				if (res.data) {
					store.dispatch({ type: UPDATE_USER, data: res.data });
				} else {
					SimpleToast.show(res.message, SimpleToast.LONG)
				}
				
			})
			.catch((err) => {
				Alert.alert('Error', JSON.stringify(err))
				console.log(err)
			})

	}

	notificationSwitchChanged=(value)=> {
		this.setState({isNotificationEnable:value})
	}
	locationSwitchChanged=(value)=> {
		this.setState({isLocationEnable:value})
	}

	componentDidMount() {}

	render() {
		return (
			// <View style={styles.container}>
			<View style={{flex: 1,}}>
				<View style={NotificationStyle.containerTop}>
					<ImageBackground
						source={require('../resources/images/bg_top.png')}
						style={NotificationStyle.imageBackground}
					>
						<Image
							style={{
								marginTop: 50,
							}}
							source={require('../resources/images/logo_big.png')}
						/>
					</ImageBackground>
				</View>
				<View style={styles.containerBottom}>
					<View style={NotificationStyle.containerBottomInner}>
						<View style={NotificationStyle.languageSection}>
							<Text style={NotificationStyle.title}>
								{__('enabling your location and notifications shall give you access to nearst providers and latest promotions.' , this.props.language)}
							</Text>

							<View style={[styles.toggleButtonContainer, NotificationStyle.toggleBtnStyle]}>
								<Text style={NotificationStyle.toggleTextStyle}>{__('Enable Notifications' , this.props.language)}</Text>
								<Switch
									style={NotificationStyle.toggleStyle}
								    onValueChange={this.notificationSwitchChanged}
									value={this.state.isNotificationEnable}
								/>
							</View>
							<View style={[styles.toggleButtonContainer, NotificationStyle.toggleBtnStyle]}>
								<Text style={NotificationStyle.toggleTextStyle}>{__('Enable Location' , this.props.language)}</Text>
								<Switch
									style={NotificationStyle.toggleStyle}
									onValueChange={this.locationSwitchChanged}
									value={this.state.isLocationEnable}
								/>
							</View>

							<TouchableOpacity onPress={()=>	
								{
									console.log('Hello');
									this.callUpdateApi();
								}
								}>
								<View style={[NotificationStyle.tapableButton, NotificationStyle.btnStyle]}>
									<Text style={styles.tapButtonStyleTextWhite}>{__('Get Started' , this.props.language)}</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				
			</View>
		);
	}
}

mapStateToProps = (state) => {
	return {
		user: state.auth.user,
		selected_car: state.auth.selected_car,
		preferences: state.init.preferences,
		language: state.language,
	}
}

mapDispatchToProps = (dispatch) => bindActionCreators(
	{
		updateUser: authAction.updateUser,
		updateLanguage: authAction.updateLanguage,
		setLanguage: setLanguage,
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(EnableNotificationScreen)

const NotificationStyle = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	tapableButton: {
		height: 60,
		justifyContent: 'center',
		backgroundColor: colors.blueButton,
		alignSelf: 'center',
		borderRadius: 50,
	},
	containerTop: {
		height: height / 2.1,
	},
	toggleStyle: {
		marginRight: 20,
	},
	toggleBtnStyle: {
		width: metrics.deviceWidth - 40,
		marginTop: 10,
	},
	toggleTextStyle: {
		color: colors.blueText,
		textAlign: 'left',
		fontFamily: Fonts.CircularBold,
		fontSize: fonts.size.h13,
		marginLeft: 20,
	},
	btnStyle: {
		width: metrics.deviceWidth - 40,
		marginTop: 20,
	},
	containerBottom: {
		height: height / 2,
		marginTop: -30,
		backgroundColor: 'white',
		borderTopEndRadius: metrics.radius15,
		borderTopStartRadius: metrics.radius15,
		padding: 50,
	},
	containerBottomInner: {
		height: 155, 
	},
	imageBackground: {
		...styles.center,
		width: '100%',
		height: '100%',
		flex: 1,
	},
	languageSectionMain: {
		color: colors.blueText,
		fontSize: fonts.size.h1,
	},
	title: {
		width: metrics.deviceWidth - 40,
		color: colors.black,
		textAlign: 'center',
		marginBottom: 20,
		fontFamily: Fonts.CircularBook,
	},
	languageSectionHelper: {
		color: colors.grey93,
	},
	sectionBreak: {
		textAlign: 'center',
		color: colors.grey93,
	},
});

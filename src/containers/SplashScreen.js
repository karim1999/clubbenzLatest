import React, { PureComponent } from 'react';
import { Image, Text, View, StyleSheet, StatusBar, AsyncStorage, Animated, Easing, ImageBackground } from 'react-native';
import { getPreferences } from './../redux/actions/init'
import { styles, fonts, colors, metrics } from '../themes';
import SimpleToast from 'react-native-simple-toast';
import NetInfo from "@react-native-community/netinfo";

import NavigationService from '../NavigationService';

class SplashScreen extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			logoTranslateYValue: new Animated.Value(200),
			opacity: new Animated.Value(1),
			logoOpacity: 0,
		}
	}

	naviagte = () => {
		NavigationService.navigate('SearchScreen', { userName: 'Lucy' });
	};

	_moveAnimation = () => {

		this.setState({ logoOpacity: 1, })
		
		Animated.timing(this.state.logoTranslateYValue, {
			toValue: 400,
			duration: 1000,
			aising: Easing.linear,
		}).start();
	}

	_fadeAnimation = () => {
		var Sound = require('react-native-sound');
		Sound.setCategory('Playback');

		var whoosh = new Sound('splash_screen.mp3', Sound.MAIN_BUNDLE, (error) => {
			if (error) {
			  console.log('failed to load the sound', error);
			  return;
			}
			// loaded successfully
			console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
			
			// Play the sound with an onEnd callback
		  whoosh.play((success) => {
			if (success) {
			  console.log('successfully finished playing');
			} else {
			  console.log('playback failed due to audio decoding errors');
			}
		  });
		  });

		Animated.timing(this.state.opacity, {
			toValue: 0,
			duration: 2000,
			useNativeDriver: true,
		}).start()
	}

	checkNumberVerified(value) {
		
				// debugger
				/*var ver_num = JSON.parse(value).verification_phone;
				var mobile = JSON.parse(value).phone;
				const data = {
					phone: mobile,
					description: '',
				}
				if (ver_num == 0) {
					console.log('Not Verified')
					authAction.verifiyNumber(data)
						.then(res => {
							if (res.success) {
								// this.props.navigation.reset([NavigationActions.navigate({ routeName: 'ForgotPasswordScreen', fromscreen: 'HomeScreen', mobile }, )], 0)
								this.props.navigation.navigate('ForgotPasswordScreen', { fromscreen: 'SplashScreen', mobile });
							}
						}).catch(err => {
							alert(JSON.stringify(err))
						})
				} else {
					// debugger
					// NetInfo.fetch().then(isConnected => {
					// 	if (isConnected)
					// 		this.props.navigation.replace('HomeScreen');
					// 	else
					// 		SimpleToast.show('Not connected to internet', SimpleToast.SHORT)
					// })
					this.props.navigation.replace('HomeScreen');
				}*/

					this.props.navigation.replace('HomeScreen');
	}

	componentDidMount() {

		getPreferences()

		this._fadeAnimation()

		AsyncStorage.getItem('user').then(value=>{

			setTimeout(() => {

			this._moveAnimation()

			setTimeout(() => {
				if(value){
					this.checkNumberVerified(value);
				}
				else{
					this.props.navigation.replace('LanguageScreen');
				}
			}, 1200)

		}, 2000);

		})
	}

	render() {

		return (
			<View style={[styles.screen.container, styleSplashScreen.container]}>
				<StatusBar hidden={true} />
				<View
					style={{
						alignItems: 'center',
						marginBottom: metrics.doubleBaseMargin,
					}}
				>
					<View style={[styles.center, styleSplashScreen.picture]}>
					<ImageBackground source={require('../resources/images/splash_screen.jpg')} style={[styles.center, styleSplashScreen.picture]}>
					<Animated.View style={{width: metrics.deviceWidth, backgroundColor: "#000000", flex: 1, opacity: this.state.opacity,  }}>
					</Animated.View>
					<View style={{ opacity: this.state.logoOpacity, }}>
					<Animated.Image
							// source={require('../resources/images/clubenz_logo.png')}
							source={require('../resources/images/benz_logo.png')}
							style={[styleSplashScreen.logo, { bottom: this.state.logoTranslateYValue }]}
							resizeMode='contain'
						/>
					</View>
					</ImageBackground>
					</View>		

				</View>
			</View>
		);
	}
}

export default SplashScreen;

const styleSplashScreen = StyleSheet.create({
	container: {
		backgroundColor: colors.black,
		alignItems: 'center',
		marginBottom: -30
	},
	picture: {
		flex: 1,
		width: metrics.deviceWidth,
		height: metrics.deviceHeight,
	},
	logo: {
		width: 200,
		height: 100,
	},
	text: {
		fontSize: 20,
		color: "#fff",
		fontWeight: "bold",
		textAlign: "center"
	  },
});

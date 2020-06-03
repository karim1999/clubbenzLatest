import React, { PureComponent } from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, Dimensions, Image, ImageBackground, Animated } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { styles, fonts, colors, metrics } from '../themes';
const { width, height } = Dimensions.get('window');
import NavigationService from '../NavigationService';
import {setLanguage} from './../redux/actions/language'
import {ENGLISH,ARABIC} from './../redux/actions/types'
import { Fonts } from '../resources/constants/Fonts';
import Advertisement from '../components/advertisement/advertisement';
// import BackgroundTask from 'react-native-background-task'

import { LoginManager, AccessToken } from "react-native-fbsdk";

// import firebase from 'react-native-firebase';

const navigationOptions = {
	header: null,
};

// BackgroundTask.define(() => {
// 	console.log(new Date() + ' Hello from a background task')
// 	BackgroundTask.finish()
//   })

class LanguageScreen extends PureComponent {
	constructor(props) {
		super(props);
		this.openHowToScreen = this.openHowToScreen.bind(this);
	}

	testFacebook = () => {
		// debugger


		// LoginManager.setLoginBehavior('browser');
		// LoginManager.logInWithPermissions(["public_profile"]).then(
		// 	function(result) {
		// 	  if (result.isCancelled) {
		// 		console.log("Login cancelled");
		// 	  } else {
		// 		console.log(
		// 			alert("Login success with permissions: " +
		// 			result.grantedPermissions.toString())
		// 		);
		// 	  }
		// 	},
		// 	function(error) {
		// 	  console.log("Login fail with error: " + error);
		// 	}
		// );

		AccessToken.getCurrentAccessToken().then((data) => {
            if (data == null) {
                LoginManager.logInWithPermissions(["public_profile"]).then(
                    function(result) {
                      if (result.isCancelled) {
                        console.log("Login cancelled");
                      } else {
                        console.log(
                            alert("Login success with permissions: " +
                            result.grantedPermissions.toString())
                        );
                      }
                    },
                    function(error) {
                      console.log("Login fail with error: " + error);
                    }
                  );
            } else {
                alert(JSON.stringify(data))
            }
        })
	}

	openHowToScreen(language) {
		this.props.setLanguage(language)
		this.props.navigation.replace('HowToScreen');
		// NavigationService.navigate('HowToScreen', { userName: 'Lucy' });
		// NavigationService.navigate('HowToScreen', { userName: 'Lucy' });
	}

	componentDidMount() {
		// BackgroundTask.schedule({
		// 	period: 900, // Aim to run every 30 mins - more conservative on battery
		// })
	}

	// async componentDidMount() {
	// 	const fcm_token = await firebase.messaging().getToken();
	// 	if (fcm_token)
	// 		alert(fcm_token)
	// 	else
	// 		alert('error fcm')
	// }

	render() {
		return (
			<View style={[styleSplashScreen.container]}>
				<View style={styleSplashScreen.containerTop}>
					{/* <Advertisement /> */}
					<ImageBackground
						source={require('../resources/images/bg_top.png')}
						style={styleSplashScreen.imageBackground}
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
					<View style={styleSplashScreen.containerBottomInner}>
						<View style={styleSplashScreen.languageSection}>
							<Text style={[styleSplashScreen.languageSectionHelper, {fontFamily: Fonts.CircularMedium}]}>Continue in</Text>
							<TouchableOpacity onPress={()=>this.openHowToScreen(ENGLISH)}>
								<Text style={[styleSplashScreen.languageSectionMain, {fontFamily: Fonts.CircularMedium}]}>English</Text>
							</TouchableOpacity>
						</View>
						<View>
							<Text style={styleSplashScreen.sectionBreak}> ____________</Text>
						</View>
						<View style={styleSplashScreen.languageSection}>
						<Text style={[styleSplashScreen.languageSectionHelper, {fontFamily: Fonts.GE_SS_MEDIUM}]}>كمل باللغة</Text>
							<TouchableOpacity onPress={()=>this.openHowToScreen(ARABIC)}>
								<Text style={[styleSplashScreen.languageSectionMain, {fontFamily: Fonts.GE_SS_MEDIUM}]}>العربية</Text>
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
	  user: state.util.user
	}
  }
  mapDispatchToProps = (dispatch) => bindActionCreators(
    {
      setLanguage:setLanguage
    },
    dispatch
  );
  
  export default connect(null, mapDispatchToProps)(LanguageScreen)

const styleSplashScreen = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	containerTop: {
		height: height / 1.75,
	},
	containerBottom: {
		height: height / 2.3,
		backgroundColor: 'white',
		borderTopEndRadius: metrics.radius15,
		borderTopStartRadius: metrics.radius15,
	},
	containerBottomInner: {
		height: '100%',
	},
	imageBackground: {
		...styles.center,
		width: '100%',
		height: '100%',
		flex: 1,
	},
	languageSection: {
		...styles.center,
	},
	languageSectionMain: {
		color: colors.blueText,
		fontSize: metrics.deviceWidth * 0.125,
	},
	languageSectionHelper: {
		color: colors.grey93,
		fontSize: metrics.deviceWidth * 0.04,
		marginBottom: 5,
	},
	sectionBreak: {
		textAlign: 'center',
		color: '#2557B5',
		opacity: 0.2,
		paddingTop : 15,
		paddingBottom: 10,
	},
});

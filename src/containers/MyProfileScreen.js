import React, { PureComponent } from 'react';
import {
	View,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	Text,
	Image,
	ScrollView,
	Picker,
	StatusBar, Alert,
	PermissionsAndroid, Platform, I18nManager,
} from 'react-native';
import RNRestart from 'react-native-restart';

import {UPDATE_INDICATOR_FLAG} from './../redux/actions/types';
import DropdownMenu from 'react-native-dropdown-menu';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { styles, fonts, colors, metrics } from '../themes';
import TextInput from '../vendor/react-native-material-textinput/lib/Input'
import NavigationComponent from '../components/navigation/navigation';
import SplitHeading from '../components/common/splitHeading';
import ToggleView from '../components/profile/ToggleView';
import NavigationService from '../NavigationService';
import StaticUsersView from '../components/common/staticUsersView';
import ImagePicker from 'react-native-image-picker';
import * as authAction from './../redux/actions/auth'
import { IMG_PREFIX_URL, PROFILE_PIC_PREFIX } from './../config/constant';
import __ from '../resources/copy'
import { updateProfile } from "./../redux/actions/auth";
import { UPDATE_USER, UPDATE_SELECTED_CAR, UPDATE_LANGUAGE } from "../redux/actions/types";
import { store } from "./../redux/create"
import { Fonts } from '../resources/constants/Fonts';
import { setLanguage } from '../redux/actions/language';
import { ENGLISH, ARABIC } from '../redux/actions/types';

import { AccessToken, LoginManager, GraphRequest, GraphRequestManager, LoginBehaviorIOS } from 'react-native-fbsdk';
import SimpleToast from 'react-native-simple-toast';
import { returnProfilePicture, returnProfilePictureWithoutPrefix } from '../components/profile/ProfilePicture';

const { width, height } = Dimensions.get('window');

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const linkToFB = false;

import Permissions, {request, PERMISSIONS} from 'react-native-permissions';
import {getMemberships} from '../redux/actions/membership';

class MyProfileScreen extends PureComponent {
	constructor(props) {
		super(props);
		this._responseInfoCallback = this._responseInfoCallback.bind(this)
		const { user } = this.props
		// debugger
		this.state = {
			language: 'English',
			email: user.email,
			mobile: user.phone,
			password: "",
			last_name: user.last_name,
			first_name: user.first_name,
			acceptTerms: false,
			profile_picture: '',
			fb_picture: user.fb_picture,

			enableLocation: user.enableLocation == "true" ? true : false,
			enablePushNotification: user.enablePushNotification == "true" ? true : false,
			enableFacebook: user.enableFacebook == "true" ? true : false,

			enableLinkToFacebook: false,
			fromPicker: false,
			fromPicker_uri: '',
			updated_car: false,
			car: this.props.selected_car.car,
			car_type: this.props.selected_car.car_type,
			model: this.props.selected_car.model,
			years: {},
			model_id: user.model_id,
			car_type_id: user.car_type_id,
			car_vin_prefix: user.car_vin_prefix,
			year_id: user.year_id,
			text: '',
			selected_language: '',
			fb__pic: '',
			current: null

		};

	}

	// for getting user's profile image from facebook

	getFacebookProfileFromFacebook = async() => {
		// debugger
		const self = this;
		if (self.state.enableFacebook) {
			// here get the user profile image

			AccessToken.getCurrentAccessToken().then((data) => {
				if (data == null) {
					if (Platform.OS === "android") {
						LoginManager.setLoginBehavior("web_only")
					}
					LoginManager.logInWithPermissions(["public_profile"]).then(
						function(result) {
						  if (result.isCancelled) {
							console.log("Login cancelled");
						  } else {
								console.log("Login success with permissions: " +
								result.grantedPermissions.toString());
								this.callFetchApi(data.accessToken)
						  }
						},
						function(error) {
						  console.log("Login fail with error: " + error);
						}
					  );
				} else {
					console.log(JSON.stringify(data))
					this.callFetchApi(data.accessToken)
				}
			})


			// AccessToken.getCurrentAccessToken().then((data) => {
			// 	if (data == null) {
			// 		LoginManager.logInWithPermissions(['public_profile', 'email']).then((result) => {
			// 			AccessToken.getCurrentAccessToken().then((data) => {
			// 				debugger
			// 				this.callFetchApi(data.accessToken)


			// 			}).catch((error) => console.log(error));
			// 		}).catch((error) => console.log(error));
			// 	} else {
			// 		debugger
			// 		this.callFetchApi(data.accessToken)
			// 	}
			// })

		}
	}

	callFetchApi = (token) => {
		const self = this;
		fetch(`https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=${token}`)
		.then(responJson=>responJson.json()).then(function(response){

			// debugger

			let full_name = response.name.split(' ')
			let id = response.id;

			const first_name = full_name[0];
			const last_name = full_name[1];
			const email = response.email;
			const social_id = response.id;

			const infoRequest = new GraphRequest(id,
			  {
				parameters: {
				  fields: {
					string: 'picture.type(large)'
				  }
				}
			  },
			  self._responseInfoCallback,
			)

			  new GraphRequestManager().addRequest(infoRequest).start();

		  }).catch(err=>[
			alert(err)
		  ])
	}

	_responseInfoCallback(error: ?Object, result: ?Object) {
		let self = this;
		if (error) {
			console.log('Error fetching data: ' + error.toString());
			console.log(error)
		} else {
			console.log('Success fetching data: ' + result.toString());
			console.log(result)
			var url = result.picture.data.url;
			self.setState({ fb_picture: result.picture.data.url })
			self.updateUserProfilePic();
		}
	}

	// end of getting profile picture from facebook

	getMonth = (month) => {
		return month.toString().length == 1 ? '0' + month : month
	}

	showImagePicker = async() => {

		const options = {
			title: 'Select Avatar',
			maxWidth: 1000,
			maxHeight: 1000,
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
		};

		if (this.props.user.enableFacebook == 'true')  {
			SimpleToast.show('Facebook sync enabled please disable and update your profile !', SimpleToast.SHORT)
		}
		else {

			Permissions.checkMultiple(['camera', 'photo']).then(response => {
				debugger
				if (response.camera === 'denied' || response.photo === 'denied') {
					Alert.alert(
						'Clubbenz needs camera and photos access',
						'Clubbenz Camera and Photos Permission',
				  [
					{
					  text: 'Cancel',
					  onPress: () => console.log('Permission denied'),
					  style: 'cancel',
					},
					{text: 'Open Settings', onPress: Permissions.openSettings},
				  ],
					);
				} else if (response.camera === 'authorized' && response.photo === 'authorized') {

					ImagePicker.showImagePicker(options, (response) => {
						console.log('Response = ', response);

						if (response.didCancel) {
							console.log('User cancelled image picker');
						} else if (response.error) {
							console.log('ImagePicker Error: ', response.error);
						} else if (response.customButton) {
							console.log('User tapped custom button: ', response.customButton);
						} else {

							this.setState({ fromPicker: true });
							const fromPicker_uri = response.uri;
							// debugger
							const photo = response;
							// debugger
							this.setState({ fromPicker_uri, photo })
						}
					});
				} else if (response.camera === 'undetermined' || response.photo === 'undetermined') {
					ImagePicker.showImagePicker(options, (response) => {
						console.log('Response = ', response);

						if (response.didCancel) {
							console.log('User cancelled image picker');
						} else if (response.error) {
							console.log('ImagePicker Error: ', response.error);
						} else if (response.customButton) {
							console.log('User tapped custom button: ', response.customButton);
						} else {

							this.setState({ fromPicker: true });
							const fromPicker_uri = response.uri;
							// debugger
							const photo = response;
							// debugger
							this.setState({ fromPicker_uri, photo })
						}
					});
				}
			})
		}
	}

	updateSelectedCar = (car_info, year_id) => {

		var car = {
			acceleretion_second: car_info.acceleretion_second,
			chassis: car_info.chassis,
			displacement: car_info.displacement,
			fuel_per_hundred_km: car_info.fuel_per_hundred_km,
			fuel_type: car_info.fuel_type,
			horse_power: car_info.horse_power,
			id: car_info.id,
			model: car_info.model,
			model_id: car_info.model_id,
			model_text: car_info.model_text,
			model_year_end: car_info.model_year_end,
			model_year_start: car_info.model_year_start,
			motor_code: car_info.motor_code,
			oil_capacity_liter: car_info.oil_capacity_liter,
			text1: car_info.text1,
			text2: car_info.text2,
			tires: car_info.tires,
			top_speed: car_info.top_speed,
			vin_prefix: car_info.vin_prefix,
			wheels: car_info.wheels,
		}
		var car_type = car_info.fuel_type;
		var model = car_info.model_id;

		this.setState({
			car: car,
			updated_car: true,
			car_type: car_type,
			model: model,
			model_id: model.id,
			car_type_id: car_type.id,
			car_vin_prefix: car.vin_prefix,
		});
		if (this.props.preferences.years != null) {
			for (i = 0; i < this.props.preferences.years.length; i++) {
				if (this.props.preferences.years[i].id == year_id) {
					this.setState({
						years: this.props.preferences.years[i],
						year_id: this.props.preferences.years[i].id,
					});
				}
			}
		}

	}

	updateUserProfilePic = () => {
		const payload = {

			first_name: this.state.first_name,
			last_name: this.state.last_name,
			email: this.state.email,
			mobile: this.state.mobile,
			fb_picture: this.state.fb_picture,
			enablePushNotification: this.state.enablePushNotification,
			enableLocation: this.state.enableLocation,
			enableFacebook: this.state.enableFacebook,
			token: this.props.user.token,
			model_id: this.state.model_id,
			car_type_id: this.state.car_type_id,
			car_vin_prefix: this.state.car_vin_prefix,
			year_id: this.state.year_id,
		}

		if (this.state.updated_car) {
			store.dispatch({
				type: UPDATE_SELECTED_CAR,
				data: {
					year: this.state.years,
					model: this.state.model,
					car_type: this.state.car_type,
					car: this.state.car
				}
			});
		}
		// alert(payload.fb_picture)
		updateProfile(payload)
			.then((res) => {
				if (res.success) console.log('Profile picture Updated Successfully')
				console.log('Not updated')
				if (res.data) {
					store.dispatch({ type: UPDATE_USER, data: res.data });
				}
			})
			.catch((err) => {
				Alert.alert('Error', JSON.stringify(err))
				console.log(err)
			})
	}

	udpateProfile = async() => {

		const payload = {

			first_name: this.state.first_name,
			last_name: this.state.last_name,
			email: this.state.email,
			password: this.state.password,
			mobile: this.state.mobile,
			profile_picture: this.state.fromPicker ? {
				name: this.state.photo.fileName ? this.state.photo.fileName : 'profile_' + Date.now() + '.JPG',
				type: this.state.photo.type ? this.state.photo.type : "image/jpeg",
				uri: this.state.photo.uri
			} : this.state.profile_picture,
			enablePushNotification: this.state.enablePushNotification,
			enableLocation: this.state.enableLocation,
			enableFacebook: this.state.enableFacebook,
			token: this.props.user.token,
			model_id: this.state.model_id,
			car_type_id: this.state.car_type_id,
			car_vin_prefix: this.state.car_vin_prefix,
			year_id: this.state.year_id,
		}

		if (this.state.updated_car) {
			debugger
			store.dispatch({
				type: UPDATE_SELECTED_CAR,
				data: {
					year: this.state.years,
					model: this.state.model,
					car_type: this.state.car_type,
					car: this.state.car
				}
			});
		}

		// debugger
		updateProfile(payload)
			.then((res) => {
				// debugger
				if (res.success) {
					// Alert.alert('Info', 'Profile Updated Successfully');


					setTimeout(() => {
						// SimpleToast.show('Profile Updated Successfully', 1000)
						Alert.alert(
						'Info!',
						'Profile Updated Successfully',
						[
							{ text: 'OK', onPress: () => store.dispatch({type:UPDATE_INDICATOR_FLAG,data:false}) },
						],
						{ cancelable: false }
					)
					}, 200)


				} else {
					store.dispatch({type:UPDATE_INDICATOR_FLAG,data:false})
				}
				console.log(res)
				// here update the name which we are showing in the navigation
				if (res.data) {
					// debugger
					// alert(JSON.stringify(res.data))
					store.dispatch({ type: UPDATE_USER, data: res.data });
					// if (res.data.enableFacebook == 'true')
					// 	this.getFacebookProfileFromFacebook();
					console.log(store.getState());
				} else {
					SimpleToast.show(res.message, SimpleToast.LONG)
				}
			})
			.catch((err) => {
				Alert.alert('Error', JSON.stringify(err))
				console.log(err)
			})
	}

	async componentDidMount() {
		// if (this.props.navigation.state.params.updateCar != null && this.props.navigation.state.params.updateCar == true) {
		// 	this.setState({ updated_car: true})
		// }
		// this.getFacebookProfileFromFacebook()

		if (this.props.preferences.years != null) {
			for (i = 0; i < this.props.preferences.years.length; i++) {

				if (this.props.preferences.years[i].id == this.props.user.year_id) {
					this.setState({
						years: this.props.preferences.years[i]
					});
				}
			}
		}
		if (this.props.language.isArabic == true)
			this.setState({ selected_language: 'العربية' });
		else
			this.setState({ selected_language: 'English' });

		let memberships= getMemberships(this.props.user.id).then(res => {
			this.setState({current: res.current})
		})

	}


	updateUserLanguage = (value) => {

		if (value == 'Arabic'){
			this.props.setLanguage(ARABIC);
			I18nManager.forceRTL(true)
			setTimeout(() => {
				RNRestart.Restart();
			}, 200)

		}	else if (value == 'English'){
			this.props.setLanguage(ENGLISH);
			I18nManager.forceRTL(false)
			setTimeout(() => {
				RNRestart.Restart();
			}, 200)
		}

		console.log(store.getState());

	}

	render() {

		console.log('Language is ' + this.state.language);

		var data = [["Arabic", "English"]];
		const { user } = this.props;

		// const profile_picture = user.profile_picture != '' ? { uri: PROFILE_PIC_PREFIX + user.profile_picture } : (user.fb_picture != '' ? { uri: user.fb_picture } : require('../resources/images/ic_menu_userplaceholder.png'))
		var months;
		if(this.props.language.isArabic)
			months = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
				"يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
			];
		else{
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		}

		const profile_picture = returnProfilePicture(this.props.user);

		var member_since = user.created_date;

		const [y, m, d] = member_since.split('-');
		member_since = months[m - 1] + '-' + y;

		const { model, years } = this.state;
		const car_image = model.image == '' ? require('../resources/images/Image10.png') : { uri: IMG_PREFIX_URL + model.image }
		console.log(this.state.fb__pic)
		return (
			<View style={[styleMyProfileScreen.container]}>
				<StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
				<NavigationComponent homeButton={false}	navigation={this.props.navigation}
														title={__('My Profile', this.props.language)} goBack={() => NavigationService.goBack()} />
				<ScrollView>
					<Text
						style={{
							color: '#8E8E93',
							textAlign: 'center',
							fontSize: width * 0.04,
							paddingTop: height * 0.01,
							fontFamily: Fonts.CircularBook,
						}}
					>
						{__('Choose another model', this.props.language)}
					</Text>
					<Text style={{ color: '#0e2d3c', textAlign: 'center', fontSize: width * 0.08, fontFamily: Fonts.CircularBold }}>
						{this.props.language.isArabic ? model.arabic_name : model.name}
					</Text>
					<TouchableOpacity onPress={() => NavigationService.navigate('CarSelectionScreen', { MyProfileScreen: true, updateSelectedCar: this.updateSelectedCar })}>
						<View style={{ height: height * 0.1, width: width * 0.4, alignSelf: 'center' }}>
							<Image
								source={car_image}
								style={{ flex: 1, height: null, width: null, resizeMode: 'contain' }}
							/>
						</View>
					</TouchableOpacity>
					<SplitHeading
						text={this.state.years.name}
						headingStyle={{ padding: 10, marginTop: 0 }}
						lineColor={{ backgroundColor: '#77777a' }}
						textColor={{ color: '#77777a', fontFamily: Fonts.CircularBold }}
					/>
					<View
						style={{ backgroundColor: '#fff', paddingVertical: height * 0.01, borderRadius: width * 0.05 }}
					>
						{
							this.state.current &&
							<View
								style={{
									backgroundColor: '#11455f',
									flexDirection: 'row',
									alignItems: 'center',
									borderRadius: width * 0.05,
									paddingHorizontal: width * 0.02,
									paddingVertical: width * 0.01,
									alignSelf: 'center',
								}}
							>
								<Text
									style={{
										color: '#fff',
										fontSize: width * 0.025,
										fontFamily: Fonts.CircularBoldItalic,
									}}
								>
									{this.state.current.name}
								</Text>
							</View>
						}
						<View style={[styles.center, { flexDirection: 'row', marginTop: 3 }]}>
							<Text style={{ textAlign: 'center', color: '#8E8E93', fontFamily: Fonts.CircularMediumItalic, fontSize: width * 0.035, }}>
								{__('Member since', this.props.language)}
							</Text>
							<Text style={{ marginLeft: 5, fontFamily: Fonts.CircularMediumItalic, color: '#000000', fontSize: width * 0.035, }}>{member_since}</Text>
						</View>
						<View
							style={{

							}}
						>
							<StaticUsersView profile_picture={profile_picture} profile_pictures={this.props.preferences.profile_pictures} updateProfileImage={this.showImagePicker} profile={true} fromPicker={this.state.fromPicker} fromPicker_uri={this.state.fromPicker_uri} />

							<View style={{ height: 22 }}>
								<Text style={[styleMyProfileScreen.placeHolder1]}>{__("Add your photo", this.props.language)}</Text>
							</View>
						</View>
						<View style={styleMyProfileScreen.innerContainer}>
							<View style={{ flexDirection: 'row', marginVertical: 10 }}>
								<View style={[{ flex: 1, marginLeft: 13, }]}>
									<TextInput
										textInputStyle={{ textAlign: 'center', fontFamily: Fonts.CircularMedium, }}
										label={__('First name', this.props.language)}
										onChangeText={first_name => this.setState({ first_name })}
										value={this.state.first_name}
										placeholderColor='rgba(0,0,0, 0.4)'
										underlineColor='#E5E5EA'
									/>
								</View>
								<View style={[{ flex: 1, marginLeft: 13 }]}>
									<TextInput
										textInputStyle={{ textAlign: 'center', fontFamily: Fonts.CircularMedium }}
										label={__('Surname', this.props.language)}
										onChangeText={last_name => this.setState({ last_name })}
										value={this.state.last_name}
										placeholderColor='rgba(0,0,0, 0.4)'
										underlineColor='#E5E5EA'
									/>
								</View>
							</View>
							<TextInput
								style={styles.inputField}
								textInputStyle={{ textAlign: 'center', fontFamily: Fonts.CircularMedium }}
								type={'email'}
								editable={true}
								label={__('Email Address', this.props.language)}
								onChangeText={email => this.setState({ email })}
								value={this.state.email}
								placeholderColor='rgba(0,0,0, 0.4)'
								underlineColor='#E5E5EA'
							/>

							<TextInput
								style={styles.inputField}
								textInputStyle={{ textAlign: 'center', fontFamily: Fonts.CircularMedium, marginTop: 10 }}
								keyboardType={'phone-pad'}
								editable={false}
								label={__('Mobile Number', this.props.language)}
								onChangeText={mobile => this.setState({ mobile })}
								value={this.state.mobile}
								placeholderColor='rgba(0,0,0, 0.4)'
								underlineColor='#E5E5EA'
							/>
							<View style={{ marginTop: 60 }}>
								<TextInput
									style={styles.inputField}
									editable={true}
									textInputStyle={{ textAlign: 'center', fontFamily: Fonts.CircularMedium, marginTop: 10 }}
									secureTextEntry={true}
									label={__('Password', this.props.language)}
									onChangeText={password => this.setState({ password })}
									value={this.state.password}
									placeholderColor='rgba(0,0,0, 0.4)'
									underlineColor='#E5E5EA'
								/>
							</View>
						</View>

						<TouchableOpacity onPress={this.udpateProfile}>
							<View style={[styles.tapableButton, styleMyProfileScreen.btnStyle]}>
								<Text style={styles.tapButtonStyleTextWhite}>{__('Update Changes', this.props.language)}</Text>
							</View>
						</TouchableOpacity>
					</View>

					<View
						style={{
							backgroundColor: '#fff',
							marginVertical: 20,
							paddingTop: height * 0.02,
							paddingBottom: height * 0.03,
							borderRadius: width * 0.05,
						}}
					>



						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',

								borderBottomWidth: 1,

								borderBottomColor: colors.gray100,
								borderBottomStartRadius: width * 0.1,
								borderBottomEndRadius: width * 0.1,

								width: metrics.deviceWidth,
								flex: 1,
								height: 70,

							}}
						>
							<View style={{}}>
								<Text style={{ color: '#626262', fontFamily: Fonts.CircularBold, width: metrics.deviceWidth / 2, textAlign: 'left' }}>{__('Change Language', this.props.language)}</Text>
							</View>

							<View>
								<Picker
									onValueChange={(itemValue, itemIndex) => { this.setState({ language: itemValue, selected_language: itemValue, }); this.updateUserLanguage(itemValue) }}
									selectedValue={this.state.selected_language}

									style={{ width: width * 0.3 }}>
									<Picker.Item label="العربية" value="Arabic" />
									<Picker.Item label="English" value="English" />

								</Picker>
							</View>

						</View>

						<View
							style={{
								flexDirection: 'column',
								justifyContent: 'space-around',
								alignItems: 'center',
								marginTop: 20
							}}
						>
							<ToggleView text={__('Enable Notifications', this.props.language)} value={this.state.enablePushNotification} onChange={(val) => this.setState({ enablePushNotification: val })} />
							<ToggleView text={__('Enable Location', this.props.language)} value={this.state.enableLocation} onChange={(val) => this.setState({ enableLocation: val })} />
							<ToggleView text={__('Link to Facebook', this.props.language)} value={this.state.enableFacebook} facebook onChange={(val) => this.setState({ enableFacebook: val })} />
						</View>

					</View>
				</ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(MyProfileScreen)

const styleMyProfileScreen = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#efeff4',
	},
	innerContainer: {
		marginTop: 20,
		borderColor: colors.grey93,
		paddingLeft: 20,
		paddingRight: 20,
	},
	placeHolder1: {
		color: colors.grey93,
		textAlign: 'center',
		fontSize: 12,
		fontFamily: Fonts.CircularBook,
	},
	placeHolder: {
		color: colors.grey93,
		textAlign: 'center',
		fontSize: fonts.size.h14,
	},
	btnStyle: {
		width: metrics.deviceWidth - 40,
		marginVertical: 15,
	},
	termsText: {
		color: colors.blueButton,
		textDecorationLine: 'underline',
		fontWeight: '400',
	},
	title: {
		fontFamily: fonts.type.base,
		fontSize: fonts.size.h14,
		color: colors.blueButton,
		textAlign: 'center',
		marginTop: 15,
	},
	staticImages: {
		borderRadius: 80,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

import React, { PureComponent } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TextInput,
	Image,
	StatusBar,
	FlatList,
	ScrollView,
	NativeModules,
	TouchableOpacity,
	Platform,
	Dimensions,
	AsyncStorage,
	PermissionsAndroid,
	Linking,
	Share,
	Alert,
	InteractionManager
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { styles, fonts, colors, metrics } from '../themes';
import NavigationService from '../NavigationService';
import NavigationComponent from '../components/navigation/navigation';
import { NavigationActions } from 'react-navigation';
import HomeAd from '../components/common/homeAd';
import SplitHeading from '../components/common/splitHeading';
import Geolocation from 'react-native-geolocation-service';
import StaticUsersView from '../components/common/staticUsersView';
import RoundedButton from '../components/common/RoundedButton';
import ServiceItem from '../components/services/Service';
import * as authAction from './../redux/actions/auth'
import { IMG_PREFIX_URL, PROFILE_PIC_PREFIX } from './../config/constant';
import * as homeAction from "../redux/actions/home";
import { Fonts } from '../resources/constants/Fonts';
import __ from '../resources/copy';
import Advertisement from '../components/advertisement/advertisement';
import moment from 'moment';
import { returnProfilePicture } from '../components/profile/ProfilePicture';

import Permissions from 'react-native-permissions';

import SimpleToast from 'react-native-simple-toast';

import { ShareDialog } from 'react-native-fbsdk';

import firebase from 'react-native-firebase';

const shareLinkContent = {
	contentType: 'link',
	contentUrl: "https://facebook.com",
	contentDescription: 'Wow, check out this great site!',
};

const statusBarHeight = Platform.OS === 'ios' ? 22 : NativeModules.HEIGHT;
const WIDTH_WIDGET = (metrics.deviceWidth - 2 * 3) / 3;
const { width, height } = Dimensions.get('window');

var slide_images = [];

class HomeScreen extends PureComponent {
	constructor(props) {
		super(props);

		NetInfo.fetch().then(isConnected => {
			if (isConnected) {
			}
			else
				SimpleToast.show('Not connected to internet', SimpleToast.BOTTOM)
		})

	}

	state = {
		computationDone: false,
		searchText: '',
		locationPermission: '',
		shareText: 'Hey! Downlaod Clubenz App now at https://www.google.com/',
		data: [
			{
				serviceName: 'Workshops',
				arabic_serviceName: 'مراكز الخدمة',
				serviceUrl: require('../resources/icons/ic_workshops.png'),
				path: 'WorkShopListScreen',
				Location: true
			},
			{
				serviceName: 'Part shops',
				arabic_serviceName: 'محلات قطع غيار',
				// serviceUrl: require('../resources/icons/ic_partshops.png'),
				serviceUrl: require('../resources/icons/partshop_icon.jpeg'),
				path: 'PartShopScreen',
				Location: true
			},
			{
				serviceName: 'Services',
				arabic_serviceName: 'الخدمات',
				serviceUrl: require('../resources/icons/ic_services.png'),
				path: 'ServiceListScreen',
				Location: true
			},
			{
				serviceName: 'Part Catalog',
				arabic_serviceName: 'كتالوج قطع الغيار',
				serviceUrl: require('../resources/icons/pistons.png'),
				// path: 'PartListScreen',
				path: 'CategoriesScreen',
			},
			{
				serviceName: 'Cluster error',
				arabic_serviceName: 'اخطاء العداد',
				serviceUrl: require('../resources/icons/cluster_icon.png'),
				path: 'SpecificationScreen',
			},
			// {
			// 	serviceName: 'Tires',
			// 	serviceUrl: require('../resources/icons/ic_tires.png'),
			// 	path: 'ServiceListScreen',
			// 	Location:true
			// },
		],
		viewSearchSection: false,
		viewServicesSection: false,
		active_index: 1,
		slider_images: [],
	};

	componentDidMount() {
		//console.log("preferences",this.props.preferences);
		if(!this.props.preferences.activate_part_catalogue){
			let newData= [...this.state.data]
			newData.splice(3,1)
			this.setState({data: newData})
		}
		window.navigation = this.props.navigation;
		InteractionManager.runAfterInteractions(() => {
			this.serviceHome();
			this.displayOverlay();
			this.getSliderImages();
			AsyncStorage.getItem('Notification').then((data) => {

				// alert(JSON.stringify(data))
			})
		})
	}

	// getAdvertisement = () => {

	// 	if (this.props.preferences.home_ads != null) {
	// 		for (i = 0; i < this.props.preferences.home_ads.length; i++) {
	// 			if (this.props.preferences.home_ads[i].type === "Walk Out") {

	// 				return this.props.preferences.home_ads[i];
	// 			}
	// 		}

	// 		return '';
	// 	}
	// }

	getAdvertisement = () => {
		// debugger
		if (this.props.preferences && this.props.preferences.timeDisplay && this.props.preferences.timeDisplay[0] !=null) {
			return this.props.preferences && this.props.preferences.timeDisplay ? this.props.preferences.timeDisplay[0] : null;
		}
		return '';
	}

	getTimer = () => {
		if (this.props.preferences && this.props.preferences.timeDisplay && this.props.preferences.timeDisplay[0] != null) {
			return this.compareAndReturnTime(this.props.preferences.timeDisplay[0].time_out);
		}
	}

	compareAndReturnTime = (time) => {
		var now = moment.utc();
		var then = moment(time);
		var duration = moment.duration(then.diff(now));
		var arr = [];
		if (duration > 0) {
			arr.push(Math.floor(duration.asHours()));
			arr.push(Math.floor((duration.asMinutes() % 60)));
			arr.push(Math.floor((duration.asSeconds()) % 60));
			arr.push(Math.floor(duration));
			return arr;
		}
		return false;
	}

	// getSliderImages = () => {
	// 	var count = 0;
	// 	var images = [];
	// 	if (this.props.preferences.home_ads != null) {
	// 		for (var i = 0; i < this.props.preferences.home_ads.length; i++) {
	// 			if (this.props.preferences.home_ads[i].type == 'Slider') {
	// 				count++;
	// 				images.push(this.props.preferences.home_ads[i])
	// 				// alert(JSON.stringify(this.props.preferences.home_ads[i]))
	// 			}
	// 		}

	// 		slide_images = images;
	// 		console.log('Slider Images are')
	// 		console.log(slide_images)
	// 	} else {
	// 		images.push('');
	// 		images.push('');
	// 		images.push('');
	// 		slide_images = images;
	// 	}
	// 	// this.setState({
	// 	// 	slider_images: images
	// 	// })
	// }

	getSliderImages = () => {
		// var count = 0;
		// var images = [];
		// if (this.props.preferences.home_slide != null) {
		// 	images.push(this.props.preferences.home_slide[0])
		// 	images.push(this.props.preferences.home_slide[1])
		// 	images.push(this.props.preferences.home_slide[2])
		// 	slide_images = images;
		// 	console.log('Slider Images are')
		// 	console.log(slide_images)
		// } else {
		// 	// images.push('');
		// 	// images.push('');
		// 	// images.push('');
		// 	slide_images = images;
		// }
	}

	serviceHome() {
		homeAction
			.homeService()
			.then(res => {
				//console.log("homeService" , res);
				if (res.home_page_services === "Home page Services Not Available") {

				} else {
					this.setState({ data: [...this.state.data, ...res.home_page_services] })
				}

			})
			.catch(err => {
				//console.log("error" , JSON.stringify(err));
			});
	}

	displayOverlay = async () => {
		AsyncStorage.getItem("displayOverlays").then(value => {
			if (value != null) {

			} else {

				this.setState({
					viewSearchSection: false,
					viewServicesSection: false,
				});
			}
		});


	}

	_alertForLocationPermission() {
		Alert.alert(
			'Clubenz Location Permission',
			'Clubenz need to access your current location' +
			"to locate the nearest shops.",
			[
				{
					text: 'Cancel',
					onPress: () => {},
					style: 'cancel',
				},
				this.state.locationPermission == 'undetermined'
					? { text: 'OK', onPress: this._requestPermission }
					: { text: 'Open Settings', onPress: Permissions.openSettings },
			],
		);
	}


	_requestPermission = () => {
		Permissions.request('location').then(response => {
			// Returns once the user has chosen to 'allow' or to 'not allow' access
			// Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
			this.setState({ locationPermission: response });
		});
	};

	getLocationAndNavigate = (data) => {
		Geolocation.getCurrentPosition(
			(position) => {
				//console.log(position)
				const pos = {
					coords: {
						accuracy: 17.291000366210938,
						altitude: 171.5,
						heading: 0,
						// latitude: 31.5429824,
						// longitude: 74.4008077,
						latitude: 0,
						longitude: 0,
						speed: 0
					},
					mocked: false,
					timestamp: 1564646352931
				}
				//console.log(pos)

				var value = this.props.user.enableLocation == 'true' ? position : pos;

				NavigationService.navigate(data.path, { position: value, preferences: this.props.preferences, homeButton: false });
			},
			(error) => {
				// See error code charts below.
				//console.log(error.code, error.message);
			},
			{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
		);
	}

	onMenuPress = async (data) => {

		if (data.Location) {

			if (this.props.user.enableLocation == 'true') {

				if (Platform.OS === "android") {
					const granted = await PermissionsAndroid.request(
						PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
						{
							title: "Clubenz Location Permission",
							message:
								"Clubenz needs access to your Location " +
								"to locate the nearest shops."
						}
					);
					if (granted === PermissionsAndroid.RESULTS.GRANTED) {
						this.getLocationAndNavigate(data)
					} else {
						alert(granted);
					}
				} else {
					Geolocation.requestAuthorization();

					Permissions.request('location').then(response => {
						// Returns once the user has chosen to 'allow' or to 'not allow' access
						// Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'

						if (response === 'authorized') {
							//console.log('authorized')

							this.getLocationAndNavigate(data)

						} else {
							// asking for permission using Permissions dialog.
							Alert.alert(
								'Location Access',
								'Clubenz needs access to your location',
								[
									{
										text: 'Cancel',
										onPress: () => {},
										style: 'cancel',
									},
									{ text: 'Open Settings', onPress: Permissions.openSettings },
								],
							);

						}
					});

				}

			} else {
				const pos = {
					coords: {
						accuracy: 17.291000366210938,
						altitude: 171.5,
						heading: 0,
						// latitude: 31.5429824,
						// longitude: 74.4008077,
						latitude: 0,
						longitude: 0,
						speed: 0
					},
					mocked: false,
					timestamp: 1564646352931
				}
				NavigationService.navigate(data.path, { position: pos, preferences: this.props.preferences, homeButton: false });
			}
		} else {

			// debugger

			if (data.path === "SpecificationScreen") {
				NavigationService.navigate(data.path, { selected_car: this.props.selected_car.car, selected_car_model: this.props.selected_car.model, selected_car_year: this.props.selected_car.year, user: this.props.user, preferences: this.props.preferences, homeButton: false });
			} else if (data.path === "CategoriesScreen") {
				//console.log(this.props.auth)
				// debugger
				// alert(JSON.stringify(this.props.user))
				NavigationService.navigate(data.path, { chassis: this.props.selected_car.car.chassis, selected_car: this.props.selected_car.car, preferences: this.props.preferences, homeButton: false });
			} else if (data.show_services == "on") {

				AsyncStorage.setItem("serviceId", data.id);

				if (this.props.user.enableLocation == "true") {

					if (Platform.OS === "android") {
						const granted = await PermissionsAndroid.request(
							PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
							{
								title: "Clubenz Location Permission",
								message:
									"Clubenz needs access to your Location " +
									"to locate the nearest shops."
							}
						);

						if (granted === PermissionsAndroid.RESULTS.GRANTED) {
							Geolocation.getCurrentPosition(
								(position) => {
									this.props.navigation.navigate("ServiceShopScreen", { position, preferences: this.props.preferences, homeButton: false });
								},
								(error) => {
									// See error code charts below.
									//console.log(error.code, error.message);
								},
								{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
							);
						} else {
							alert(granted);
						}
					} else {
						//console.log('IOS')
					}

				} else {
					const pos = {
						coords: {
							accuracy: 17.291000366210938,
							altitude: 171.5,
							heading: 0,
							// latitude: 31.5429824,
							// longitude: 74.4008077,
							latitude: 0,
							longitude: 0,
							speed: 0
						},
						mocked: false,
						timestamp: 1564646352931
					}
					this.props.navigation.navigate("ServiceShopScreen", { position: pos, preferences: this.props.preferences });
				}


			} else {
				NavigationService.navigate(data.path);
			}


		}

	};

	renderItem = ({ item, index }) => {
		//console.log("data",this.state.data);
		return <ServiceItem data={item} navigate={this.onMenuPress} language={this.props.language} />;
	};

	onInviteOwnerPress = () => {

		Share.share({
			message: this.state.shareText.toString()
		}).then(result => {
		//console.log(result);
		}).catch(errorMsg => {
		//console.log(errorMsg);
		});

		//console.log(JSON.stringify(this.props.preferences))
	};

	onDismissPress = async () => {

		this.setState({
			viewSearchSection: false,
			viewServicesSection: false,
		});
		AsyncStorage.setItem("displayOverlays", "Hide");
		// we will set state to hide the overlay view
	};

	onSlidePress = () => {
		this.props.navigation.openDrawer();
	};

	onNextPress = async (val) => {
		if (val == 'fromSearch') {
			this.setState({
				viewSearchSection: false,
				viewServicesSection: true,
			});
		} else {
			this.setState({
				viewSearchSection: false,
				viewServicesSection: false,
			});
		}
		AsyncStorage.setItem("displayOverlays", "Hide");
	};

	gotoPrevious = () => {
		let active_index = this.state.active_index
		active_index = active_index - 1
		if (active_index >= 1) {
			this.refs.car_slider.scrollTo({ x: width * (active_index - 1), y: 0, animated: true })
		}
	}

	gotoNext = () => {
		let active_index = this.state.active_index
		active_index = active_index + 1
		if (active_index <= 3) {
			this.refs.car_slider.scrollTo({ x: width * (active_index - 1), y: 0, animated: true })
		}
	}

	__changeView = (event: Object) => {
		if (event.nativeEvent.contentOffset.x == 0) {
			this.setState({ active_index: 1 })
		}
		else if (event.nativeEvent.contentOffset.x.toFixed(0) == width.toFixed(0)) {
			this.setState({ active_index: 2 })
		}
		else if (event.nativeEvent.contentOffset.x.toFixed(0) == (width * 2).toFixed(0)) {
			this.setState({ active_index: 3 })
		}
		else if (event.nativeEvent.contentOffset.x.toFixed(0) == (width * 3).toFixed(0)) {
			this.setState({ active_index: 4 })
		}
	}

	onPressAd = (link) => {
		// Linking.openURL(link).catch((err) => console.error('An error occurred', err));
		if (link !== '') {
			Linking.canOpenURL(link)
				.then((supported) => {
					if (!supported) {
						//console.log("Can't handle url: " + link);
					} else {
						return Linking.openURL(link);
					}
				})
				.catch((err) => {
					//console.log('An error occurred', err)
				});
		}
	}

	navigateToHomeListScreen = () => {
		Geolocation.getCurrentPosition(
			(position) => {
				var text = this.state.searchText;
				this.setState({ searchText: '' })
				this.props.navigation.navigate("HomeListScreen", { position, searchText: text, preferences: this.props.preferences });
			},
			(error) => {
				// See error code charts below.
				//console.log(error.code, error.message);
			},
			{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
		);
	}

	onSeachSubmit = async () => {

		if (this.state.searchText) {


			if (Platform.OS == "android") {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
					{
						title: "Clubenz Location Permission",
						message:
							"Clubenz needs access to your Location " +
							"to locate the nearest shops."
					}
				);
				if (granted === PermissionsAndroid.RESULTS.GRANTED) {
					this.navigateToHomeListScreen()
				} else {
					alert(granted);
				}
			} else {
				//  IOS app version

				Geolocation.requestAuthorization();
				Permissions.request('location').then(response => {

					if (response === 'authorized') {
						//console.log('authorized')

						this.navigateToHomeListScreen()

					} else {
						// asking for permission using Permissions dialog.
						Alert.alert(
							'Location Access',
							'Clubenz needs access to your location',
							[
								{
									text: 'Cancel',
									onPress: () => {},
									style: 'cancel',
								},
								{ text: 'Open Settings', onPress: Permissions.openSettings },
							],
						);
						//console.log('denied')
					}
				});

			}
		} else {
			alert('Please Enter Some Key To Search');
		}
	}

	renderAds = () => {
		// debugger
		if (this.props.preferences && this.props.preferences.banner && this.props.preferences.banner[0] != null && this.props.preferences.banner[0].status === 'active' && this.props.preferences.banner[0].type === 'Home Page Bottom') {
			// debugger
			return <HomeAd home_ads={this.props.preferences.banner[0]} />
		} else {
			return null;
		}
	}

	render() {

		const user = this.props.user
		// const profile_picture = user.profile_picture != '' ? { uri: PROFILE_PIC_PREFIX + user.profile_picture } : require('../resources/images/ic_menu_userplaceholder.png')
		const profile_picture = returnProfilePicture(user);

		return (
			<View style={[styleHomeScreen.container, { zIndex: -99 }]}>
				<StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content' />
				<NavigationComponent					navigation={this.props.navigation}
                                                        onMenuPress={this.onSlidePress} menuIcon={true} headerimageIcone={true} />
				{

					this.props.preferences && this.props.preferences.timeDisplay && this.props.preferences.timeDisplay[0] != null && this.props.preferences.timeDisplay[0].status === "active" && this.getTimer()?
						<Advertisement ad={this.getAdvertisement()} time={this.getTimer()} /> : null


				}
				<ScrollView style={{ flex: 1, zIndex: -99, marginTop: -15, }}>
					<ScrollView
						overScrollMode="never"
						style={{ flex: 1, zIndex: -99, }}
						ref="car_slider"
						pagingEnabled
						horizontal
						scrollEventThrottle={16}
						showsHorizontalScrollIndicator={false}
						onScroll={this.__changeView}>
						{this.props.preferences && this.props.preferences.home_slide && this.props.preferences.home_slide.length > 0 ?
							<TouchableOpacity onPress={() => this.onPressAd(this.props.preferences.home_slide[0].link)} >
								<Image
									style={[styleHomeScreen.pageViewer]}
									resizeMode="stretch"
									source={{ uri: IMG_PREFIX_URL + this.props.preferences.home_slide[0].image }} />
							</TouchableOpacity> : null}
						{this.props.preferences && this.props.preferences.home_slide && this.props.preferences.home_slide.length > 1 ?
							<TouchableOpacity onPress={() => this.onPressAd(this.props.preferences.home_slide[1].link)} >
								<Image
									style={styleHomeScreen.pageViewer}
									resizeMode="stretch"
									source={{ uri: IMG_PREFIX_URL + this.props.preferences.home_slide[1].image }} />
							</TouchableOpacity> : null}
						{this.props.preferences && this.props.preferences.home_slide && this.props.preferences.home_slide.length > 2 ?
							<TouchableOpacity onPress={() => this.onPressAd(this.props.preferences.home_slide[2].link)} >
								<Image
									style={styleHomeScreen.pageViewer}
									resizeMode="stretch"
									source={{ uri: IMG_PREFIX_URL + this.props.preferences.home_slide[2].image }} />
							</TouchableOpacity> : null}
					</ScrollView>

					<TouchableOpacity onPress={this.gotoPrevious}
						style={{ height: 36, width: 36, borderRadius: 40, backgroundColor: '#11455F', opacity: 0.4, position: 'absolute', /*top: 70*/ top: (height / 2.77) / 2, left: '2%', justifyContent: 'center', alignItems: 'center', }}>
						<FontAwesome name="angle-left" color="#FFFFFF" size={20} />
					</TouchableOpacity>

					<TouchableOpacity onPress={this.gotoNext}
						style={{ height: 36, width: 36, borderRadius: 40, backgroundColor: '#11455F', opacity: 0.4, position: 'absolute', /*top: 70*/ top: (height / 2.77) / 2, right: '2%', justifyContent: 'center', alignItems: 'center' }}>
						<FontAwesome name="angle-right" color="#FFFFFF" size={20} />
					</TouchableOpacity>

					<View style={{ width: width, height: '100%', justifyContent: 'center', flexDirection: 'row', position: 'absolute', /*top: 190*/ top: (height / 2.77) - 20, }}>
						<View
							style={{
								height: width * 0.01,
								borderRadius: width * 0.01,
								width: width * 0.05,
								backgroundColor: this.state.active_index == 1 ? '#e6eff9' : '#0e2d3c',
							}}
						/>
						<View
							style={{
								height: width * 0.01,
								borderRadius: width * 0.01,
								width: width * 0.05,
								marginLeft: width * 0.02,
								backgroundColor: this.state.active_index == 2 ? '#e6eff9' : '#0e2d3c',
							}}
						/>
						<View
							style={{
								height: width * 0.01,
								borderRadius: width * 0.01,
								width: width * 0.05,
								marginLeft: width * 0.02,
								backgroundColor: this.state.active_index == 3 ? '#e6eff9' : '#0e2d3c',
							}}
						/>
					</View>
					<View style={styleHomeScreen.searchBar}>
						<TextInput
							style={{ fontSize: 16, fontFamily: Fonts.CircularBold, flex: 0.85 }}
							underlineColorAndroid="transparent"
							keyboardType="default"
							placeholder={__('try local name to find a service provider', this.props.language)}
							placeholderTextColor={colors.blueOpacity40}
							onChangeText={searchText => this.setState({ searchText })}
							value={this.state.searchText}
							onSubmitEditing={this.onSeachSubmit}
						/>
						<TouchableOpacity style={{ flex: 0.15, justifyContent: 'center', alignItems: 'flex-end', alignSelf: 'center' }} onPress={this.onSeachSubmit} >
							<Image style={{ width: 40, height: 40, }} source={require('../resources/icons/search.png')} />
						</TouchableOpacity>
					</View>

					<FlatList
						style={{ backgroundColor: colors.white }}
						data={this.state.data}
						renderItem={this.renderItem}
						keyExtractor={(item, index) => index.toString()}
						numColumns={3}
						contentContainerStyle={{ flex: 1 }}
					/>

					{/* <Text>Ad here </Text> */}

					{this.renderAds()}

					<SplitHeading
						text={__('Share with friends', this.props.language)}
						headingStyle={{ padding: 10, marginTop: 12 }}
						lineColor={{ backgroundColor: 'rgba(6,0,41, 0.2)' }}
						textColor={{ color: '#000000', fontSize: 25, fontFamily: Fonts.circular_book }}
					/>

					{this.props.preferences.profile_pictures ? <StaticUsersView home={true} profile_picture={profile_picture} profile_pictures={this.props.preferences.profile_pictures} /> : null}

					<Text style={
						styleHomeScreen.bottomText}>
						{__('Your opinion matters', this.props.language)}
					</Text>
					<RoundedButton buttonText={__('Invite Owners', this.props.language)} onPress={() => this.onInviteOwnerPress()} />
				</ScrollView>
				{this.state.viewSearchSection ? (
					<View style={styleHomeScreen.overlayScreen}>
						<View
							style={{
								height: metrics.deviceHeight * 0.36,
								// backgroundColor: 'transparent',
								backgroundColor: 'rgba(14, 45, 60, 0.9)',
							}}
						/>
						<View style={{ position: 'absolute', top: metrics.deviceHeight * 0.12, left: 0, right: 0 }}>
							<View style={{ alignSelf: 'center', width: '90%' }}>
								<Text style={{ color: '#FFF', fontSize: 31, fontFamily: Fonts.CircularBold, alignSelf: 'center', textAlign: 'center' }}>{__('Search for what are you looking for', this.props.language)}</Text>
							</View>
							{/* <View style={{paddingTop:14}}>
									<Text style={{color:'#FFF',fontSize:12,alignSelf:'center',textAlign:'center',width:'80%'}}>Your opinion matters</Text>
								</View> */}
						</View>
						<View
							style={{
								backgroundColor: 'white',
								borderBottomWidth: 1,
								borderBottomColor: colors.grey93,
								height: 66,
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
								// paddingHorizontal: metrics.doubleBasePadding,
							}}
						>
							<TextInput
								style={{ fontSize: 18 }}
								underlineColorAndroid="transparent"
								keyboardType="default"
								placeholder={__('try local name to find a service provider', this.props.language)}
								placeholderTextColor={colors.blueOpacity40}
								onChangeText={searchText => this.setState({ searchText })}
								value={this.state.searchText}
								editable={false}
							/>
							<Image
								style={{ width: 40, height: 40 }}
								source={require('../resources/icons/search.png')}
							/>
						</View>
						<View
							style={{
								flex: 1,
								// backgroundColor: 'transparent',
								backgroundColor: 'rgba(14, 45, 60, 0.9)',
							}}
						>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									paddingTop: 12,
									paddingHorizontal: 36,
									alignItems: 'center',
								}}
							>
								<TouchableOpacity onPress={this.onDismissPress}>
									<Text style={{ color: colors.white, fontSize: 17, fontFamily: Fonts.CircularMedium }}>{__('Dismiss', this.props.language)}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => this.onNextPress('fromSearch')}
									style={{
										width: 162,
										height: 60,
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: 'white',
										borderRadius: 58,
									}}
								>
									<Text style={{ color: '#1E313E', fontSize: 17, fontFamily: Fonts.CircularMedium }}>{__('Next', this.props.language)}</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				) : this.state.viewServicesSection ? (
					<View style={styleHomeScreen.overlayScreen}>
						<View
							style={{
								height: metrics.deviceHeight * 0.4,
								// backgroundColor: 'transparent',
								backgroundColor: 'rgba(14, 45, 60, 0.9)',
							}}
						/>
						<View style={{ position: 'absolute', top: metrics.deviceHeight * 0.22 /*top: metrics.deviceHeight * 0.18*/, left: 0, right: 0 }}>
							<View style={{ alignSelf: 'center', width: '90%' }}>
								<Text style={{ color: '#FFF', fontSize: 31, fontFamily: Fonts.CircularBold, alignSelf: 'center', textAlign: 'center' }}>{__('Discover top services you want', this.props.language)}</Text>
							</View>

						</View>
						<View
							style={{
								backgroundColor: 'white',
								height: WIDTH_WIDGET * 2,
							}}
						>
							<FlatList
								style={{ backgroundColor: colors.white }}
								data={this.state.data}
								renderItem={this.renderItem}
								keyExtractor={(item, index) => index.toString()}
								numColumns={3}
								contentContainerStyle={{ flex: 1 }}
							/>
						</View>
						<View
							style={{
								flex: 1,
								// backgroundColor: 'transparent',
								backgroundColor: 'rgba(14, 45, 60, 0.9)',
							}}
						>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									paddingTop: 12,
									paddingHorizontal: 36,
									alignItems: 'center',
									marginTop: 20,
								}}
							>
								<TouchableOpacity onPress={this.onDismissPress}>
									<Text style={{ color: colors.white, fontSize: 17, fontFamily: Fonts.CircularMedium }}>{__('Dismiss', this.props.language)}</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => this.onNextPress('fromServices')}
									style={{
										width: 162,
										height: 60,
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: 'white',
										borderRadius: 58,
									}}
								>
									<Text style={{ color: '#1E313E', fontSize: 17, fontFamily: Fonts.CircularMedium }}>{__('Next', this.props.language)}</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				) : null}
			</View>
		);
	}
}

mapStateToProps = (state) => {
	return {
		user: state.auth.user,
		preferences: state.init.preferences,
		selected_car: state.auth.selected_car,
		language: state.language,
		auth: state.auth,
	}
}
mapDispatchToProps = (dispatch) => bindActionCreators(
	{
		updateUser: authAction.updateUser
	},
	dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

const styleHomeScreen = StyleSheet.create({
	container: {
		flex: 1,
	},
	pageViewer: {
		// aspectRatio: 1.777,
		height: height / 2.77,
		width: metrics.deviceWidth,
		zIndex: -10,
	},
	searchBar: {
		flex: 1,
		borderBottomWidth: 1,
		borderBottomColor: colors.grey93,
		height: 66,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: metrics.doubleBasePadding,
	},
	bottomText: {
		fontSize: 14,
		color: colors.blueText,
		textAlign: 'center',
		marginVertical: 12,
		marginHorizontal: 12,
		fontFamily: Fonts.CircularBook,
	},
	overlayScreen: {
		flex: 1,
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: colors.blueOpacity,
	},
});

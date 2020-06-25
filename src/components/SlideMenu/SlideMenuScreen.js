import React, { Component } from 'react';
import { I18nManager, Text, View, StyleSheet, StatusBar, Dimensions, Image, TouchableOpacity, Platform, AsyncStorage, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/AntDesign';
import IconF from 'react-native-vector-icons/Feather';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { colors } from '../../themes';
import NavigationService from '../../NavigationService';
import * as authAction from './../../redux/actions/auth'
import { IMG_PREFIX_URL, PROFILE_PIC_PREFIX } from './../../config/constant';
import { Height } from '../../config/dimensions';
const { width, height } = Dimensions.get('window');
import { StackActions } from 'react-navigation';
import { Fonts } from '../../resources/constants/Fonts';
import __ from '../../resources/copy';
import { returnProfilePicture, returnProfilePictureWithoutPrefix } from '../../components/profile/ProfilePicture';
import RNRestart from 'react-native-restart';

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class SlideMenuScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: 1,
		};
	}
	componentDidMount() {
		const selected = this.props.navigation.getParam('selected', 1);
		this.setState({ selected: selected });
	}
	logout = () => {
		AsyncStorage.clear()
		authAction.logOut({ token: this.props.user.token })
		NavigationService.reset('LanguageScreen', {restart: true})
		I18nManager.forceRTL(false)
		setTimeout(() => {
			RNRestart.Restart();
		}, 1000)

	}

	getMonth = (month) => {
		return month.toString().length == 1 ? '0' + month : month
	}

	render() {
		const { user, selected_car } = this.props;
		// let created_date = new Date(user.created_date.slice(0,10))
		// const member_since = this.getMonth(created_date.getMonth()) +'.'+created_date.getFullYear()
		var months;
		if(this.props.language.isArabic)
			months = ["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
				"يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
			];
		else{
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		}
		var member_since = user.created_date;

		// const str1 = member_since;
		// const [y, m, d] = str1.split('-');
		// var month = Number(m)

		// debugger

		const [y, m, d] = member_since != null ? member_since.split('-') : [1, 1, 1970];
		member_since = months[m-1] + '-' + y;

		console.log({member_since})


		// const profile_picture = user.profile_picture != '' ? PROFILE_PIC_PREFIX + user.profile_picture : ( user.fb_picture != '' ? user.fb_picture : undefined)
		const profile_picture = returnProfilePicture(user);
		const isDrawerOpen = this.props.navigation.state.isDrawerOpen
		const { model, year } = selected_car
		const car_image = model.image == '' ? require('../../resources/images/Image10.png') : { uri: IMG_PREFIX_URL + model.image }

		return (
			<View style={style.container}>
				<StatusBar hidden={false} backgroundColor={isDrawerOpen ? colors.drawerStatusBar : colors.navgationBar} barStyle='light-content' />
				<View style={style.topContainer}>
					<LinearGradient
						start={{ x: 0.0, y: 0.0 }}
						end={{ x: 0.0, y: 1.0 }}
						locations={[0.2, 1]}
						colors={['#0E191F', '#324553']}
						style={[style.rightContainer, { paddingTop: height * 0.04 }]}
					>
                        <View style={[style.leftContainer, { backgroundColor: '#0E191F' }]} />

                        <ScrollView >
							<View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
								<TouchableOpacity onPress={() => this.props.navigation.closeDrawer()}>
									<View style={{ marginRight: width * 0.05 }}>
										<Icon name={I18nManager.isRTL ? "arrowleft" : "arrowright"} size={width * 0.07} color="#fff" />
									</View>
								</TouchableOpacity>
							</View>

                            <View style={{ flex: 9, paddingTop: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: height * 0.048, marginLeft: width * 0.2 }}>
                                    {this.state.selected === 1 ? (
                                        <View
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                position: 'absolute',
                                                transform: [{ rotate: '-90deg' }],
                                                left: -width * 0.2
                                            }}
                                        >
                                            <Text style={{ color: 'white', fontFamily: Fonts.CircularBold, fontSize: 18/*fontSize: width * 0.04*/, fontFamily: Fonts.CircularBold }}>
                                                {model.name}
                                            </Text>
                                            <View
                                                style={{
                                                    marginVertical: height * 0.005,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Image
                                                    resizeMode="contain"
                                                    style={{ width: width * 0.2, height: width * 0.07 }}
                                                    source={car_image}
                                                />
                                            </View>
                                        </View>
                                    ) : (
                                        <View />
                                    )}
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ selected: 1 });
                                            this.props.navigation.closeDrawer();
                                            this.props.navigation.navigate('Home');
                                        }}
                                    >
                                        <View
                                            style={{
                                                borderLeftWidth: this.state.selected === 1 ? 2 : 0,
                                                borderColor: 'white',
                                                // paddingHorizontal: width * 0.17,
                                                paddingHorizontal: width * 0.1,
                                                paddingVertical: height * 0.01,
                                            }}
                                        >
                                            <Text style={{ color: 'white', fontSize: 22/*fontSize: width * 0.06*/, fontFamily: Fonts.CircularBook }}>{__('Home' , this.props.language)}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: height * 0.048, marginLeft: width * 0.2 }}>
                                    {this.state.selected === 3 ? (
                                        <View
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                position: 'absolute',
                                                transform: [{ rotate: '-90deg' }],
                                                left: -width * 0.2
                                            }}
                                        >
                                            <Text style={{ color: 'white', fontFamily: Fonts.CircularBold, fontSize: 18/*fontSize: width * 0.04*/, fontFamily: Fonts.CircularBold }}>
                                                {model.name}
                                            </Text>
                                            <View
                                                style={{
                                                    marginVertical: height * 0.005,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Image
                                                    resizeMode="contain"
                                                    style={{ width: width * 0.2, height: width * 0.07 }}
                                                    source={car_image}
                                                />
                                            </View>
                                        </View>
                                    ) : (
                                        <View />
                                    )}
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ selected: 3 });
                                            this.props.navigation.closeDrawer();
                                            this.props.navigation.navigate('CarGuide', { fromSlideMenu: true });
                                        }}
                                    >
                                        <View
                                            style={{
                                                borderLeftWidth: this.state.selected === 3 ? 2 : 0,
                                                borderColor: 'white',
                                                // paddingHorizontal: width * 0.17,
                                                paddingHorizontal: width * 0.1,
                                                paddingVertical: height * 0.01,
                                            }}
                                        >
                                            <Text style={{ color: 'white', fontSize: 22/*fontSize: width * 0.06*/, fontFamily: Fonts.CircularBook }}>{__('Car Guide' , this.props.language)}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
								<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: height * 0.048, marginLeft: width * 0.2 }}>
									{this.state.selected === 5 ? (
										<View
											style={{
												justifyContent: 'center',
												alignItems: 'center',
												position: 'absolute',
												transform: [{ rotate: '-90deg' }],
												left: -width * 0.2
											}}
										>
											<Text style={{ color: 'white', fontFamily: Fonts.CircularBold, fontSize: 18/*fontSize: width * 0.04*/, fontFamily: Fonts.CircularBold }}>
												{model.name}
											</Text>
											<View
												style={{
													marginVertical: height * 0.005,
													justifyContent: 'center',
													alignItems: 'center',
												}}
											>
												<Image
													resizeMode="contain"
													style={{ width: width * 0.2, height: width * 0.07 }}
													source={car_image}
												/>
											</View>
										</View>
									) : (
										<View />
									)}
									<TouchableOpacity
										onPress={() => {
											this.setState({ selected: 5 });
											this.props.navigation.closeDrawer();
											this.props.navigation.navigate('NotificationScreen');
										}}
									>
										<View
											style={{
												borderLeftWidth: this.state.selected === 5 ? 2 : 0,
												borderColor: 'white',
												// paddingHorizontal: width * 0.17,
												paddingHorizontal: width * 0.1,
												paddingVertical: height * 0.01,
											}}
										>
											<Text style={{ color: 'white', fontSize: 22/*fontSize: width * 0.06*/, fontFamily: Fonts.CircularBook }}>{__('Notifications' , this.props.language)}</Text>
										</View>
									</TouchableOpacity>
								</View>
								<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: height * 0.048, marginLeft: width * 0.2 }}>
									{this.state.selected === 6 ? (
										<View
											style={{
												justifyContent: 'center',
												alignItems: 'center',
												position: 'absolute',
												transform: [{ rotate: '-90deg' }],
												left: -width * 0.2
											}}
										>
											<Text style={{ color: 'white', fontFamily: Fonts.CircularBold, fontSize: 18/*fontSize: width * 0.04*/, fontFamily: Fonts.CircularBold }}>
												{model.name}
											</Text>
											<View
												style={{
													marginVertical: height * 0.005,
													justifyContent: 'center',
													alignItems: 'center',
												}}
											>
												<Image
													resizeMode="contain"
													style={{ width: width * 0.2, height: width * 0.07 }}
													source={car_image}
												/>
											</View>
										</View>
									) : (
										<View />
									)}
									<TouchableOpacity
										onPress={() => {
											this.setState({ selected: 6 });
											this.props.navigation.closeDrawer();
											this.props.navigation.navigate('BookingScreen');
										}}
									>
										<View
											style={{
												borderLeftWidth: this.state.selected === 6 ? 2 : 0,
												borderColor: 'white',
												// paddingHorizontal: width * 0.17,
												paddingHorizontal: width * 0.1,
												paddingVertical: height * 0.01,
											}}
										>
											<Text style={{ color: 'white', fontSize: 22/*fontSize: width * 0.06*/, fontFamily: Fonts.CircularBook }}>{__('My Bookings' , this.props.language)}</Text>
										</View>
									</TouchableOpacity>
								</View>
								{
									this.props.preferences.activate_part_catalogue &&
									<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: height * 0.048, marginLeft: width * 0.2 }}>
										{this.state.selected === 7 ? (
											<View
												style={{
													justifyContent: 'center',
													alignItems: 'center',
													position: 'absolute',
													transform: [{ rotate: '-90deg' }],
													left: -width * 0.2
												}}
											>
												<Text style={{ color: 'white', fontFamily: Fonts.CircularBold, fontSize: 18/*fontSize: width * 0.04*/, fontFamily: Fonts.CircularBold }}>
													{model.name}
												</Text>
												<View
													style={{
														marginVertical: height * 0.005,
														justifyContent: 'center',
														alignItems: 'center',
													}}
												>
													<Image
														resizeMode="contain"
														style={{ width: width * 0.2, height: width * 0.07 }}
														source={car_image}
													/>
												</View>
											</View>
										) : (
											<View />
										)}
										<TouchableOpacity
											onPress={() => {
												this.setState({ selected: 7 });
												this.props.navigation.closeDrawer();
												this.props.navigation.navigate('FavoritesScreen');
											}}
										>
											<View
												style={{
													borderLeftWidth: this.state.selected === 7 ? 2 : 0,
													borderColor: 'white',
													// paddingHorizontal: width * 0.17,
													paddingHorizontal: width * 0.1,
													paddingVertical: height * 0.01,
												}}
											>
												<Text style={{ color: 'white', fontSize: 22/*fontSize: width * 0.06*/, fontFamily: Fonts.CircularBook }}>{__('Favorite Parts' , this.props.language)}</Text>
											</View>
										</TouchableOpacity>
									</View>
								}
								<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: height * 0.048, marginLeft: width * 0.2 }}>
									{this.state.selected === 4 ? (
										<View
											style={{
												justifyContent: 'center',
												alignItems: 'center',
												position: 'absolute',
												transform: [{ rotate: '-90deg' }],
												left: -width * 0.2
											}}
										>
											<Text style={{ color: 'white', fontFamily: Fonts.CircularBold, fontSize: 18/*fontSize: width * 0.04*/, fontFamily: Fonts.CircularBold }}>
												{model.name}
											</Text>
											<View
												style={{
													marginVertical: height * 0.005,
													justifyContent: 'center',
													alignItems: 'center',
												}}
											>
												<Image
													resizeMode="contain"
													style={{ width: width * 0.2, height: width * 0.07 }}
													source={car_image}
												/>
											</View>
										</View>
									) : (
										<View />
									)}
									<TouchableOpacity
										onPress={() => {
											this.setState({ selected: 4 });
											this.props.navigation.closeDrawer();
											this.props.navigation.navigate('ClubScreen');
										}}
									>
										<View
											style={{
												borderLeftWidth: this.state.selected === 4 ? 2 : 0,
												borderColor: 'white',
												// paddingHorizontal: width * 0.17,
												paddingHorizontal: width * 0.1,
												paddingVertical: height * 0.01,
											}}
										>
											<Text style={{ color: 'white', fontSize: 22/*fontSize: width * 0.06*/, fontFamily: Fonts.CircularBook }}>{__('The Club' , this.props.language)}</Text>
										</View>
									</TouchableOpacity>
								</View>

								{
                                    this.props.preferences.activate_part_catalogue &&
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: height * 0.048, marginLeft: width * 0.2 }}>
                                        {this.state.selected === 2 ? (
                                            <View
                                                style={{
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    position: 'absolute',
                                                    transform: [{ rotate: '-90deg' }],
                                                    left: -width * 0.2
                                                }}
                                            >
                                                <Text style={{ color: 'white', fontFamily: Fonts.CircularBold, fontSize: 18/*fontSize: width * 0.04*/, fontFamily: Fonts.CircularBold }}>
                                                    {model.name}
                                                </Text>
                                                <View
                                                    style={{
                                                        marginVertical: height * 0.005,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Image
                                                        resizeMode="contain"
                                                        style={{ width: width * 0.2, height: width * 0.07 }}
                                                        source={car_image}
                                                    />
                                                </View>
                                            </View>
                                        ) : (
                                            <View />
                                        )}
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({ selected: 2 });
                                                this.props.navigation.closeDrawer();
                                                this.props.navigation.navigate('Parts');
                                            }}
                                        >
                                            <View
                                                style={{
                                                    borderLeftWidth: this.state.selected === 2 ? 2 : 0,
                                                    borderColor: 'white',
                                                    // paddingHorizontal: width * 0.17,
                                                    paddingHorizontal: width * 0.1,
                                                    paddingVertical: height * 0.01,
                                                }}
                                            >
                                                <Text style={{ color: 'white', fontSize: 22/*fontSize: width * 0.06*/, fontFamily: Fonts.CircularBook }}>{__('Part Catalogue' , this.props.language)}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                }






                            </View>
                        </ScrollView>
					</LinearGradient>
				</View>
				<View style={style.bottomContainer}>
					<View style={style.leftView}>
						<View style={{ height: Height(10), width: Height(10), borderRadius: Height(10), overflow: 'hidden' }}>
							<Image
								resizeMode="cover"
								source={profile_picture ? { uri: profile_picture } : require('../../resources/images/ic_menu_userplaceholder.png')}
								style={{ flex: 1, height: null, width: null }}
							/>
						</View>
					</View>
					<View style={style.midView}>
						<TouchableOpacity onPress={() => { this.props.navigation.navigate('MyProfileScreen') }}>
							<View
								style={{
									backgroundColor: colors.blueText,
									borderRadius: width * 0.05,
									paddingHorizontal: width * 0.02,
									paddingVertical: width * 0.005,
									alignSelf: 'flex-start',
								}}
							>
								<Text
									style={{
										color: '#fff',
										fontSize: width * 0.02,
										fontStyle: 'italic',
									}}
								>
									{__('Classic member' , this.props.language)}
								</Text>
							</View>
							<Text style={{ color: '#000', fontSize: width * 0.04, fontFamily: Fonts.CircularMedium, alignSelf: 'flex-start' }}>{user.first_name} {user.last_name}</Text>
							<Text style={{ fontSize: width * 0.025, fontFamily: Fonts.CircularMediumItalic }}>
							{__('Member since' , this.props.language)} <Text style={{ color: '#000' }}>{member_since}</Text>
							</Text>
						</TouchableOpacity>
					</View>
					<View style={style.rightView}>
						<TouchableOpacity onPress={() => this.logout()}>
							{/* <IconF name="log-out" size={width * 0.07} color={colors.blueText} /> */}
							<Image style={{ height: 32, width: 32, }} source={require('../../resources/images/ic-logout.png')} />
						</TouchableOpacity>
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
		updateUser: authAction.updateUser
	},
	dispatch
);

export default connect(mapStateToProps, null)(SlideMenuScreen)

const style = StyleSheet.create({
	container: { flex: 1 },
	topContainer: { flex: 9, flexDirection: 'row' },
	leftContainer: { position: 'absolute', height: height, width: width * 0.2 },
	rightContainer: { flex: 1 },
	bottomContainer: { flex: 1.1, backgroundColor: '#fff', flexDirection: 'row', padding: 10, },
	leftView: { flex: 1.5, justifyContent: 'center', alignItems: 'center' },
	rightView: { flex: 0.8, justifyContent: 'center' },
	midView: { flex: 4, justifyContent: 'center', paddingLeft: width * 0.01 },
});

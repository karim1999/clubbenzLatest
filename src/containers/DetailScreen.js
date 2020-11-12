import React, { PureComponent } from 'react';
import {
	View,
	Text,
	TouchableWithoutFeedback,
	Dimensions,
	Image,
	ImageBackground,
	StatusBar,
	TouchableOpacity,
	StyleSheet,
	FlatList,
	Modal,
	Clipboard,
	PermissionsAndroid,
	ActivityIndicator,
	Platform, I18nManager, Linking
} from 'react-native';

import { IMG_PREFIX_URL } from '../config/constant';
import { styles, fonts, colors, metrics, } from '../themes';
import SplitHeading from '../components/common/splitHeading';
import ListItem from '../components/list/ListItem';
import CustomAd from '../components/common/customAd';
const { width, height } = Dimensions.get('window');
import * as partAction from "./../redux/actions/parts";
import { getProviderDetails } from "./../redux/actions/provider";
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import Share from 'react-native-share';
import Toast from "react-native-simple-toast";

import { connect } from "react-redux";
import { ScrollView } from 'react-native-gesture-handler';
import { Fonts } from '../resources/constants/Fonts';
import __ from '../resources/copy';
import Slideshow from 'react-native-image-slider-show';

import OpenMap from "react-native-open-map";
import { ShareDialog } from 'react-native-fbsdk';
import SendSMS from 'react-native-sms';
import {addToFavorite, checkIsFavorite, getFavorites, removeFromFavorite} from '../redux/actions/favorite';
import Icon from 'react-native-vector-icons/FontAwesome';
import NavigationComponent from '../components/navigation/navigation';
import NavigationService from '../NavigationService';
import firebase from 'react-native-firebase';

const navigationOptions = {
	header: null,
};

class DetailScreen extends PureComponent {
	constructor(props) {
		super(props);
	}

	state = {
		partDetail: [],
		ler_parts: [],
		modalVisible: false,
		shareModalVisible: false,
		images: [],
		position: 0,
		indicatorSize: 4,
		interval: null,
		phoneArray: [],
		provider: {},
		isFavorite: false,
		loadingFavorite: false,
		favorites: [],
		isDone: false,
        partShareURL: ''
	}

	componentDidMount() {
		this.partDetail();
		let favorites= getFavorites(this.props.user.id).then(res => {
			this.setState({favorites: res, isDone: true})
		})
	}

	componentWillMount() {
		this.setState({
			interval: setInterval(() => {
				this.setState({
					// this is commented to remove the autoslide feature
					// position: this.state.position === this.state.pictures.length ? 0 : this.state.position + 1
				});
			}, 2000)
		});
	}

	componentWillUnmount() {
		clearInterval(this.state.interval);
	}

	/*shareFACEBOOK = () => {
		const shareOptions = {

			title: "Share Via",
			message: "Facebook",
			url: 'https://clubenzz.app.link/parts/' + this.state.partDetail.id,
			subject: "Share Link" //  for email
		};

		const shareLinkContent = {
			contentType: 'link',

			contentUrl: 'https://clubenzz.app.link/parts/' + this.state.partDetail.id,
			contentTitle: 'https://clubenzz.app.link/parts/' + this.state.partDetail.id,

			contentDescription: 'https://clubenzz.app.link/parts/' + this.state.partDetail.id,
			setQuote: 'https://clubenzz.app.link/parts/' + this.state.partDetail.id,
		};

		this.shareLinkWithShareDialog(shareLinkContent);
	}*/

	shareLinkWithShareDialog(shareLinkContent) {
		var tmp = this;
		ShareDialog.canShow(shareLinkContent).then(
			function (canShow) {
				if (canShow) {
					return ShareDialog.show(shareLinkContent);
				}
			}
		).then(
			function (result) {
				if (result.isCancelled) {
					// alert('Share cancelled');
				} else {
					// alert('Share success with postId: ' + result.postId);
				}
			},
			function (error) {
				// alert('Share fail with error: ' + error);
			}
		);
	}

	partDetail = (a) => {
		partAction.partDetail1(a ? a : this.props.navigation.state.params.partItem.id).then(res => {
			if (res) {
				let phone = JSON.stringify(res.shop_detail.phone);
				phone = phone.replace("/g", "");
				var phoneArray = phone.split(",");
				this.setState({ partDetail: res.shop_detail, phoneArray: phoneArray });
				this.setState({ similer_parts: res.similer_parts });
				var imgs = res.images;
				var prod_imgs = [];
				if (imgs != null) {
					imgs.forEach(function (item) {
						prod_imgs.push({ url: IMG_PREFIX_URL + item.photo_name });
					});
				}
				this.setState({ images: prod_imgs })
				return res.shop_detail;
			}
		}).then(res => {
			if(this.state.partDetail && this.state.partDetail.part_brand && this.state.partDetail.part_brand.length > 0){
				// alert("hi")
			}
			if(res) {
				this.setState({loadingFavorite: true});
				let provider_id = res.provider_id;
				console.log("provider_id",provider_id);
				getProviderDetails(provider_id).then(provider => {
					this.setState({loadingFavorite: false})
					console.log("provider",provider);
					this.setState({provider});
				}).then(() => {
					checkIsFavorite(this.props.user.id, res.id).then(isFavorite => {
						this.setState({isFavorite});
					    this.setState({loadingFavorite: false})
					})
				}).then(()=> {
					this.setState({loadingFavorite: false})
				})
			}
		})
	}

	addToFavorite= () => {
		this.setState({loadingFavorite: true})
		return addToFavorite(this.props.user.id, this.state.partDetail.id).then(isFavorite => {
			if(isFavorite)
				this.setState({isFavorite: true});
		}).then(() => {
			this.setState({loadingFavorite: false})
		})
	}

	removeFromFavorite= () => {
		this.setState({loadingFavorite: true})
		return removeFromFavorite(this.props.user.id, this.state.partDetail.id).then(isFavorite => {
			if(isFavorite)
				this.setState({isFavorite: false});
		}).then(() => {
			this.setState({loadingFavorite: false})
		})
	}

	renderAds = () => {
		if (this.props.preferences != null && this.props.preferences.banner[2] != null && this.props.preferences.banner[2].status === 'active' && this.props.preferences.banner[2].type === 'Company Profile') {
			return <CustomAd home_ads={this.props.preferences.banner[2]} />;
		} else {
			return null;
		}
	}

	goToBackScreen = () => {
		this.props.navigation.goBack();
	};

	opnItem = (partItem) => {
		this.partDetail(partItem.id);
	}

	showContact = async () => {
		if (Platform.OS === 'android') {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.CALL_PHONE,
				{
					title: 'Clubenz Need Call Permission',
					message:
						'Clubenz App needs access to make call ' +
						'so you can call the delear.',
					buttonNeutral: 'Ask Me Later',
					buttonNegative: 'Cancel',
					buttonPositive: 'OK',
				},
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {

				this.setState({
					modalVisible: !this.state.modalVisible
				});
			} else {

			}
		} else if (Platform.OS === 'ios') {
			this.setState({
				modalVisible: !this.state.modalVisible
			});
		}

	}

	showShare = () => {
		this.setState({ shareModalVisible: !this.state.shareModalVisible });
        this.createURL();
	};

    createURL = () => {
        const link = new firebase.links.DynamicLink('https://clubenz.com/parts/' + this.state.partDetail.id, 'https://clubenzz.page.link')
            .android.setPackageName('com.clubbenz')
			.android.setFallbackUrl('https://play.google.com/store/apps/details?id=com.clubbenz')
            .ios.setBundleId('org.reactjs.native.example.ClubBenz')
            .ios.setFallbackUrl('https://apps.apple.com/us/app/id1507160684')
			.social.setTitle("Clubenz")
			.social.setDescriptionText(__('Don’t miss the unique opportunity to gain excellent advice and insights from leading car experts – Clubenz application will help you pamper your car. To download, click on the below link', this.props.language))
			.social.setImageUrl("https://clubenz.com/clubenz-master/assets/plugins/images/admin-logo-dark.png");
        firebase.links().createShortDynamicLink(link, "SHORT").then((url) => {
            //console.log(url);
            this.setState({ partShareURL: url })
        }).catch((err) => {
          //console.log(err)
        })
  }

	shareWHATSAPP = (a) => {
		/*const shareOptions = {
			title: 'Share via',
			url: this.state.partShareURL ,
			social: Share.Social.WHATSAPP
		};
		Share.shareSingle(shareOptions);*/
        Linking.openURL(`whatsapp://send?text=${this.state.partShareURL}`);
	}

	shareFACEBOOK = () => {
        const shareLinkContent = {
              contentType: 'link',
              contentUrl: this.state.partShareURL,
              href:this.state.partShareURL,
              contentDescription: 'Wow, check out this part!',
        };

        ShareDialog.canShow(shareLinkContent).then(
          function (canShow) {
            return ShareDialog.show(shareLinkContent);
          }
        ).then(
          function (result) {
            if (result.isCancelled) {
              //console.log('Share cancelled');
            } else {
              //console.log('Share success with postId: ' + result.postId);
            }
          },
          function (error) {
            //console.log('Share fail with error: ' + error);
          }
        );
  }

	copyLink = () => {
        Clipboard.setString(this.state.partShareURL + '');
		this.setState({ shareModalVisible: !this.state.shareModalVisible });
		setTimeout(() => {
			Toast.show('Coppied Content Successfully', Toast.LONG);
		}, 100)
	}

	_renderFooter = () => {
		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					marginVertical: height * 0.02,
				}}
			>
				<TouchableOpacity>
					<View
						style={[
							styles.tapableButton,
							{
								paddingHorizontal: width * 0.3,
								backgroundColor: 'transparent',
								borderColor: colors.blueText,
								borderWidth: 1,
							},
						]}
					>
						<Text style={styles.tapButtonStyleTextBlue}>Load more</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	};

	onMapIconPress = () => {
        if(this.state.provider.governorate.Latitude && this.state.provider.governorate.Longitude){
            OpenMap.show({
                //latitude: this.state.partDetail.location_latitude,
                //longitude: this.state.partDetail.location_longitude,
                latitude: this.state.provider.governorate.Latitude,
                longitude: this.state.provider.governorate.Longitude,
                title: this.state.partDetail.name,
                cancelText: 'Close',
                actionSheetTitle: 'Chose app',
                actionSheetMessage: 'Available applications '
            });
		}
	}

	sendSMS = () => {
		// debugger
		SendSMS.send({
			body: this.state.partShareURL,
			recipients: [''],
			successTypes: ['sent', 'queued'],
			allowAndroidSendWithoutReadPermission: false
		}, (completed, cancelled, error) => {
			this.setState({ shareModalVisible: false })
			//console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);

		});
	}

	render() {
		let finalPrice= this.state.partDetail.price;
		if(this.state.partDetail.discount && this.state.partDetail.discount > 0){
			let finalPricePercent= 100 - this.state.partDetail.discount;
			finalPrice= finalPrice * finalPricePercent/100
		}

		return (
			<View style={{ flex: 1 }}>
				<StatusBar
					hidden={false}
					backgroundColor={colors.navgationBar}
				/>

				{/* <View style={{aspectRatio: 1.77, width: metrics.deviceWidth, paddingTop: 20, backgroundColor: 'black'}}> */}

				<View style={{ flex: 600, height: 280, width: metrics.deviceWidth }}>
					<NavigationComponent
						homeButton={false}
						navigation={this.props.navigation}
						goBack={this.goToBackScreen}
						title={""}
						subTitle={""}
						rightIcon
						share
						favorite
						isFavorite={this.state.isFavorite}
						onSharePress={this.showShare}
						onPressFavorite={() => {
							if(this.state.isFavorite)
								this.removeFromFavorite()
							else
								this.addToFavorite()
						}}
					/>
					{/*<View*/}
					{/*	style={{*/}
					{/*		justifyContent: 'space-between',*/}
					{/*		flexDirection: 'row',*/}
					{/*		alignItems: 'center',*/}
					{/*		paddingHorizontal: 18,*/}
					{/*		zIndex: 1,*/}
					{/*		height: 62,*/}
					{/*		paddingTop: Platform.OS === 'ios' ? 25 : 0*/}
					{/*		// backgroundColor: 'black'*/}
					{/*	}}*/}
					{/*>*/}
					{/*	<View style={{flex: 1}}>*/}
					{/*		<TouchableWithoutFeedback onPress={this.goToBackScreen}>*/}
					{/*			<Image*/}
					{/*				resizeMode="contain"*/}
					{/*				style={{ width: 32, height: 32, transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]  }}*/}
					{/*				source={require('../resources/images/ic-back.png')}*/}
					{/*			/>*/}
					{/*		</TouchableWithoutFeedback>*/}
					{/*	</View>*/}
					{/*	<View style={{flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-end"}}>*/}
					{/*		<TouchableWithoutFeedback onPress={this.showShare}>*/}
					{/*			<Image*/}
					{/*				style={{ width: 32, height: 32 }}*/}
					{/*				source={require('../resources/icons/ic-share.png')}*/}
					{/*			/>*/}
					{/*		</TouchableWithoutFeedback>*/}
					{/*		<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('HomeScreen')}>*/}
					{/*			<View style={{marginLeft: 10}}>*/}
					{/*				<Image*/}
					{/*					style={{height:27,width:27, alignItems: 'center', justifyContent: 'center'}}*/}
					{/*					resizeMode="contain"*/}
					{/*					source={require('../resources/images/white-logo.png')}*/}
					{/*				/>*/}
					{/*			</View>*/}
					{/*		</TouchableWithoutFeedback>*/}
					{/*		{*/}
					{/*			this.state.loadingFavorite ?*/}
					{/*				<TouchableWithoutFeedback>*/}
					{/*					<View style={{marginLeft: 10}}>*/}
					{/*						<ActivityIndicator size={30} color="white" />*/}
					{/*					</View>*/}
					{/*				</TouchableWithoutFeedback> :*/}
					{/*			this.state.isFavorite ?*/}
					{/*				<TouchableWithoutFeedback onPress={() => this.removeFromFavorite()}>*/}
					{/*					<View style={{marginLeft: 10}}>*/}
					{/*						<Icon name="heart" size={30} color="#F24601"/>*/}
					{/*					</View>*/}
					{/*				</TouchableWithoutFeedback>*/}
					{/*				:*/}
					{/*				<TouchableWithoutFeedback onPress={() => this.addToFavorite()}>*/}
					{/*					<View style={{marginLeft: 10}}>*/}
					{/*						<Icon name="heart-o" size={30} color="white"/>*/}
					{/*					</View>*/}
					{/*				</TouchableWithoutFeedback>*/}
					{/*		}*/}
					{/*	</View>*/}
					{/*</View>*/}
					<View style={{ zIndex: -1, marginTop: -62, }}>
						<Slideshow
							height={340}
							arrowLeft={I18nManager.isRTL ? <Image source={require('../resources/icons/right_arrow.png')} /> : <Image source={require('../resources/icons/left_arrow.png')} />}
							arrowRight={I18nManager.isRTL ? <Image source={require('../resources/icons/left_arrow.png')} /> : <Image source={require('../resources/icons/right_arrow.png')} />}
							dataSource={this.state.images}
							position={this.state.position}
							indicatorSize={this.state.indicatorSize}
							indicatorSelectedColor={colors.blueButton}
							onPositionChanged={position => this.setState({ position })}
							marginBottom={30}
							indicatorColor='#E6EFF9'
							overlay={true} />
					</View>

					{/* </View> */}

					{/* <ImageBackground
					style={{ flex: 400, width: metrics.deviceWidth, paddingTop: 20, backgroundColor: 'black' }}
					source={{ uri: IMG_PREFIX_URL + this.state.partDetail.image }}
				> */}


				</View>
				{/* </ImageBackground> */}
				{/*
				<View
					style={{
						flex: 500,
						width: metrics.deviceWidth,
						height: metrics.deviceHeight / 1.7,
					}}
				/> */}

				<View
					style={{
						width: metrics.deviceWidth,
						height: metrics.deviceHeight - 280,
						backgroundColor: 'white',
						borderTopLeftRadius: metrics.radius20,
						borderTopRightRadius: metrics.radius20,
						bottom: 0,
						left: 0,
						right: 0,
						zIndex: 10,
						top: 50,
					}}
				>
					<ScrollView nestedScrollEnabled={true}>

						<View style={{ flex: 2.5, marginTop: 14, width: width}}>

							<View
								style={{
									flexDirection: 'row',
									flex: 1,
									borderBottomWidth: 1,
									marginHorizontal: width * 0.05,
									borderBottomColor: colors.lightGray,
									paddingBottom: 10,
									marginBottom: 10,
								}}
							>

								<View style={{ flex: 0, width: width / 2}}>
									<View style={{ flexDirection: 'row', alignItems: 'flex-end', maxWidth: width / 2.2 }}>
										<Text
											ellipsizeMode="tail"
											style={{
												color: '#0E2D3C',
												fontSize: width * 0.06,
												fontFamily: Fonts.CircularBold,
												marginBottom: 10,
												maxWidth: 200,
												// flex: 0.8,
											}}
										>
											{this.props.language.isArabic == true ? this.state.partDetail.title_arabic : this.state.partDetail.title}
										</Text>
										<View style={{
											backgroundColor: 'white',
											borderColor: '#2eac6d',
											justifyContent: 'center',
											alignItems: 'center',
											width: 40,
											height: 20,
											borderRadius: 4,
											borderWidth: 1,
											marginLeft: 5,
											marginBottom: 10,
										}}>
											<Text style={{ color: '#2eac6d', fontSize: 11, fontFamily: Fonts.CircularBlack }}>{this.state.partDetail.part_case ? __(this.state.partDetail.part_case, this.props.language) : ""}</Text>
										</View>
									</View>

									<Text style={{ fontSize: 14, fontFamily: Fonts.CircularMedium, color: '#8E8E93', alignSelf: 'flex-start' }}>{__('Part Number', this.props.language)}</Text>
									<Text style={{ color: colors.blueText, fontSize: 24, fontFamily: Fonts.CircularBook, alignSelf: 'flex-start' }}>{this.state.partDetail.part_number ? this.state.partDetail.part_number : ""}</Text>
								</View>
								<View style={{ flex: 2, alignItems: 'flex-end', marginTop: 10, marginBottom: 10, maxWidth: 150, flexGrow: 1.8, }}>
									{
										this.state.partDetail.featured &&
										<View style={{
											backgroundColor: '#2eac6d',
											borderColor: '#2eac6d',
											justifyContent: 'center',
											alignItems: 'center',
											borderRadius: 20,
											paddingVertical: 5,
											paddingHorizontal: 10,
											borderWidth: 1,
											marginLeft: 5,
											marginBottom: 10,
										}}>
											<Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold', fontFamily: Fonts.CircularBlack }}>{this.state.partDetail.featured ? __("Featured", this.props.language) : ""}</Text>
										</View>
									}

									<Text style={{ color: colors.blueText, fontSize: 26, fontFamily: Fonts.CircularBook, }}>	{finalPrice ? finalPrice : "0"} {__('EGP', this.props.language)}</Text>
									{/* {this.state.partDetail.discount > 10 ? <View style={{ flexDirection: 'row' }}> */}
									{this.state.partDetail.discount && this.state.partDetail.discount > 0 ? <View style={{ flexDirection: 'row' }}>
										<View
											style={{
												// backgroundColor: colors.badge,
												backgroundColor: '#F24601',
												flexDirection: 'row',
												alignItems: 'center',
												borderRadius: width * 0.05,
												paddingHorizontal: width * 0.02,
												paddingVertical: width * 0.01,
											}}
										>
											<Text style={{ color: '#fff', fontSize: 14, fontFamily: Fonts.CircularMedium }}>{this.state.partDetail.discount ? this.state.partDetail.discount : "0"}%</Text>
										</View>
										<Text
											style={{
												color: '#8E8E93',
												fontSize: 15, textDecorationLine: 'line-through',
												paddingLeft: 5,
												fontFamily: Fonts.CircularMedium,
											}}
										>
											{this.state.partDetail.price ? this.state.partDetail.price : "0"} {__('EGP', this.props.language)}
										</Text>
									</View> : null}
								</View>
							</View>


							<View style={{ flex: 1 }}>
								<View
									style={{
										flexDirection: 'row',
										flex: 2,
										borderBottomWidth: 1,
										marginHorizontal: width * 0.05,
										borderBottomColor: colors.lightGray,
										marginBottom: 10,
										paddingBottom: 10,
									}}
								>
									<View style={{ flex: 2, justifyContent: 'center', flexDirection: 'column' }}>
										<View style={{flex: 1, alignItems: 'center', justifyContent: "center"}}>
											<Text ellipsizeMode="tail" numberOfLines={8} style={{ color: colors.blueText, fontFamily: Fonts.circular_medium, fontSize: 14, alignSelf: 'flex-start', flex: 1}}>
												{this.state.partDetail.description ? this.state.partDetail.description : __("No Description Available")}
											</Text>
											<Text ellipsizeMode="tail" numberOfLines={8} style={{ color: colors.blueText, fontFamily: Fonts.circular_medium, fontSize: 14, alignSelf: 'flex-start'}}>
												ID: <Text>{this.state.partDetail.id}</Text>
											</Text>

										</View>
										{
											this.state.partDetail && this.state.partDetail.part_brand && this.state.partDetail.part_brand.length > 0 &&
											<View style={{alignSelf:'flex-start', width: 50}}>
												<Image style={{width: 100, height: 25, resizeMode: 'stretch'}} source={{uri: IMG_PREFIX_URL+this.state.partDetail.part_brand[0].image}} />
											</View>
										}
									</View>
									{
									this.state.provider.governorate && this.state.provider.governorate.Latitude && this.state.provider.governorate.Longitude ?
									<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}} >
										<TouchableWithoutFeedback onPress={this.onMapIconPress}>
											<View style={styles.center}>
												<View style={{
														height: width * 0.2,
														width: width * 0.2,
														borderRadius: width * 0.2,
													}}>
												</View>
												<View style={{ position: 'absolute', height: width * 0.1, width: width * 0.1 }}>
													<Image
														style={{ flex: 1, height: null, width: null, resizeMode: 'contain' }}
														source={require('../resources/icons/ic_pin_selected.png')}
													/>
												</View>
												{
													this.state.provider && this.state.provider.id ?
														<Text style={{textAlign: "center"}}>{this.state.provider.governorate.name},{this.state.provider.country.name}</Text>:null
												}
											</View>
										</TouchableWithoutFeedback>
									</View>
									: null }
								</View>
							</View>
							<View style={{ flex: 1 }}>
								<View
									style={{
										flexDirection: 'row',
										marginHorizontal: width * 0.05,
										// marginBottom: height * 0.02,
										marginBottom: 10,
									}}
								>
									<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
										<Text style={{ fontSize: 12, fontFamily: Fonts.CircularMedium, color: '#0E2D3C' }}>{this.state.partDetail.views ? this.state.partDetail.views : "000"}</Text>
										<Text style={{ color: '#0E2D3C', fontFamily: Fonts.circular_book, fontSize: 10, marginLeft: 2, justifyContent: 'center', alignItems: 'center', }}>{__('Views', this.props.language)}</Text>
									</View>

									<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
										<Text style={{ fontSize: 10, fontFamily: Fonts.circular_medium, color: '#5A5A5A' }}>{this.state.partDetail.add_date ? this.state.partDetail.add_date : "17 Jan 2018, 12 PM"} </Text>
									</View>

								</View>
								<TouchableOpacity style={styles.center} onPress={this.showContact}>
									<View style={styleDetailScreen.contactBtnStyle}>
										<Text style={styleDetailScreen.btnText}>{__('Contact now', this.props.language)}</Text>
									</View>
								</TouchableOpacity>
							</View>
							{
								this.state.provider && this.state.provider.id ?
									<TouchableOpacity
										onPress={() => this.props.navigation.navigate("ProviderScreen", {provider: this.state.provider})}
										style={{
											// flex: 1,
											height: 100,
											backgroundColor: colors.grayLight,
											alignItems: "center",
											justifyContent: "center",
											marginTop: 20
										}}
									>
										<Image
											style={{height:27,width:27}}
											source={{ uri: IMG_PREFIX_URL + this.state.provider.logo }}
											// source={require('../resources/images/white-logo.png')}
										/>
										<Text style={styleDetailScreen.btnText}>{this.state.provider.store_name}</Text>
										{/*<Text>{this.state.provider.address}</Text>*/}
									</TouchableOpacity>
									: null
							}

						</View>

						<View style={{ flex: 0.2, padding: 10 }}>
							{this.renderAds()}
						</View>
						<View
							style={{
								// flex: 1,
								height: 300,
								backgroundColor: colors.grayLight,
								// marignTop: height * 0.02,
								borderTopLeftRadius: width * 0.05,
								borderTopRightRadius: width * 0.05,
							}}
						>
							<SplitHeading
								text={__('Similar Items', this.props.language)}
								headingStyle={{ padding: 5, marginTop: 5 }}
								lineColor={{ backgroundColor: 'rgba(6,0,41, 0.2)' }}
								textColor={{ color: '#8E8E93', fontFamily: Fonts.circular_medium }}
							/>
							<FlatList
								nestedScrollEnabled={true}
								style={{ height: 260, }}
								data={this.state.similer_parts}
								keyExtractor={(item, index) => item.id}
								renderItem={({ item, index }) => <ListItem favorite={this.state.favorites.filter(value => {
									//console.log(value.part_id, " , ", item.id, " , " ,value.part_id == item.id)
									return value.part_id == item.id
								}).length > 0} item={item} index={index} onPress={this.opnItem} language={this.props.language} preferences={this.props.preferences} />}
								// ListFooterComponent={this._renderFooter}
							/>
						</View>
					</ScrollView>
				</View>

				<Modal
					transparent={true}
					visible={this.state.modalVisible}
					animationType="slide"
					onRequestClose={() => {
						this.showContact();
					}}
					style={{ alignItems: 'flex-end' }}
				>
					<View style={{ flex: 1, backgroundColor: '#08080847' }} >
						<View style={{ flex: 0.3 }}></View>
						<View style={styleDetailScreen.modelStyle}>
							<View style={[styleDetailScreen.modalInnerView, { backgroundColor: '#FFFFFF' }]}>
								<View style={styles.center}>
									<Text style={{ height: 30, fontSize: 13, alignItems: "center", justifyContent: 'center', fontFamily: Fonts.CircularBold, color: '#5A5A5A', marginTop: 10, width: metrics.deviceWidth - 10, textAlign: 'center' }}>{__('Contact Us', this.props.language)}</Text>

									<FlatList
										// data={['03366024409', '03366024409', '03366024409']}
										data={this.state.phoneArray}
										//   data={this.state.phoneArray}
										keyExtractor={(item, index) => item.id}
										renderItem={({ item, index }) =>

											<TouchableOpacity style={styles.center} onPress={() => RNImmediatePhoneCall.immediatePhoneCall(item)}>

												<View style={styleDetailScreen.btnStyle}>
													<Text style={styleDetailScreen.btnText} >{item}</Text>
												</View>
											</TouchableOpacity>}
									// ListFooterComponent={this._renderFooter}
									/>

								</View>
							</View>
							<TouchableOpacity style={styles.center} onPress={this.showContact}>
								<View style={[styleDetailScreen.cancelBtnStyle, { backgroundColor: '#E6EFF9' }]}>
									<Text style={styleDetailScreen.cancelBtnText}>{__('Cancel', this.props.language)}</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

				{/*share model*/}

				<Modal
					transparent={true}
					visible={this.state.shareModalVisible}
					animationType="slide"
					onRequestClose={() => {
						this.showShare();
					}}
					style={{ alignItems: 'flex-end' }}
				>

					<View style={{ flex: 1, backgroundColor: '#08080847' }} >
						<View style={{ flex: 0.3, }}></View>
						<View style={styleDetailScreen.modelStyle}>
							<View style={styleDetailScreen.modalInnerView}>
								<View style={[styles.center, { backgroundColor: '#FFFFFF', borderRadius: metrics.radius15, }]}>

									<Text style={{ height: 30, fontSize: 13, alignItems: "center", justifyContent: 'center', fontFamily: Fonts.CircularBold, color: '#5A5A5A', marginTop: 10, borderBottomColor: '#000000', width: metrics.deviceWidth - 10, textAlign: 'center' }}>{__('Share Via', this.props.language)}</Text>

									<TouchableOpacity style={styles.center} onPress={this.shareFACEBOOK}>
										<View style={styleDetailScreen.btnStyle}>
											<Text style={styleDetailScreen.btnText} >{__('Facebook', this.props.language)}</Text>
										</View>
									</TouchableOpacity>

									<TouchableOpacity style={styles.center} onPress={this.shareWHATSAPP}>
										<View style={styleDetailScreen.btnStyle}>
											<Text style={styleDetailScreen.btnText} >{__('WhatsApp', this.props.language)}</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity style={styles.center} onPress={() => this.sendSMS()} >
										<View style={styleDetailScreen.btnStyle}>
											<Text style={styleDetailScreen.btnText} >{__('SMS', this.props.language)}</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity style={styles.center} onPress={this.copyLink}>
										<View style={styleDetailScreen.btnStyle}>
											<Text style={styleDetailScreen.btnText} >{__('Copy Link', this.props.language)}</Text>
										</View>
									</TouchableOpacity>

								</View>

							</View>
						</View>
					</View>
					<TouchableOpacity style={styles.center} onPress={this.showShare}>
						<View style={[styleDetailScreen.cancelBtnStyle, { backgroundColor: '#E6EFF9' }]}>
							<Text style={styleDetailScreen.cancelBtnText}>{__('Cancel', this.props.language)}</Text>
						</View>
					</TouchableOpacity>

				</Modal>
			</View>
		);
	}

}

mapStateToProps = state => {
	return {
		user: state.auth.user,
		language: state.language,
		preferences: state.init.preferences,
	};
};

export default connect(mapStateToProps, null)(DetailScreen)

const styleDetailScreen = StyleSheet.create({
	btnStyle: {
		width: metrics.deviceWidth - 10,
		height: 60,
		borderTopWidth: 0.5,
		borderBottomWidth: 0,
		borderRightWidth: 0,
		borderLeftWidth: 0,
		borderStyle: 'solid',
		alignItems: "center",
		justifyContent: 'center',
		// borderColor: '#3F3F3F',
	},
	btnText: {
		fontSize: 17,
		color: "#11455F",
		fontFamily: Fonts.circular_medium,
	},
	modalInnerView: {
		borderRadius: metrics.radius15,
	},
	modelStyle: {
		flex: 0.7,
		justifyContent: 'flex-end',
		marginRight: metrics.deviceWidth - (metrics.deviceWidth - 5),
		marginLeft: metrics.deviceWidth - (metrics.deviceWidth - 5),
		borderRadius: metrics.radius15,
		marginBottom: 20,
	},

	cancelBtnStyle: {
		width: metrics.deviceWidth - 10,
		height: 60,
		marginTop: 15,
		marginBottom: 20,
		backgroundColor: '#E6EFF9',
		borderRadius: metrics.radius40,
		alignItems: "center",
		justifyContent: 'center',
	},
	cancelBtnText: {
		color: '#0E2D3C',
		fontSize: 18,
		fontFamily: Fonts.CircularBold,
		textAlign: 'center',
	},
	contactBtnStyle: {
		width: metrics.deviceWidth - 40,
		height: 60,
		fontFamily: Fonts.CircularMedium,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: '#11455F',
		borderWidth: 1,
		borderStyle: 'solid',
		borderRadius: metrics.radius40,
		marginBottom: 4,
	}
});

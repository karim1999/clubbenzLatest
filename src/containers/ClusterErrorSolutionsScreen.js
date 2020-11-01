import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Text,
	StyleSheet,
	StatusBar,
	FlatList,
	TouchableOpacity,
	ImageBackground,
	Dimensions,
	Modal,
	AsyncStorage,
	TextInput,
	Image,
	Clipboard,
	Platform,
	Alert,
	Linking
} from 'react-native';
import NavigationComponent from '../components/navigation/navigation';
import { colors, styles, metrics, fonts } from '../themes';
import SplitHeading from '../components/common/splitHeading';
import ClusterErrorSolutionItem from '../components/error/clusterErrorSolutionItem';
import * as carAction from "../redux/actions/car_guide";
const { width, height } = Dimensions.get('window');
import ImageViewer from 'react-native-image-zoom-viewer';
import { IMG_PREFIX_URL } from '../config/constant';
import { Fonts } from '../resources/constants/Fonts';
import __ from '../resources/copy';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import * as authAction from './../redux/actions/auth'
import Toast from "react-native-simple-toast";
import Slideshow from 'react-native-image-slider-show';
import NavigationService from '../NavigationService';
import Share from 'react-native-share';
import { ShareDialog } from 'react-native-fbsdk';
import SendSMS from 'react-native-sms';
import Spinner from 'react-native-loading-spinner-overlay';
import SimpleToast from 'react-native-simple-toast';
import Permissions, { request, PERMISSIONS } from 'react-native-permissions';
import firebase from 'react-native-firebase';

class ClusterErrorSolutionsScreen extends Component {
	constructor(props) {
		super(props);
		// alert(JSON.stringify(this.props.selected_car))
	}
	state = {
		count: 0,
		isLiked: false,
		errorSolutionList: [],
		modalVisible: false,
		addSolModalVisible: false,
		shareModalVisible: false,
		error_details: [],
		solution: '',
		profile_picture: '',
		photo: {},
		pictures: [],
		position: 0,
		indicatorSize: 4,
		interval: null,
		spinner: false,
		errorShareURL: ''
	};

	showImagePicker = async () => {

		const options = {
			title: 'Select Avatar',
			maxWidth: 300,
			maxHeight: 300,
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
		};

		Permissions.checkMultiple(['camera', 'photo']).then(response => {
			debugger
			if (response.camera === 'denied' || response.photo === 'denied') {
				Alert.alert(
					'Clubenz needs camera and photos access',
					'Clubenz Camera and Photos Permission',
					[
						{
							text: 'Cancel',
							onPress: () => console.log('Permission denied'),
							style: 'cancel',
						},
						{ text: 'Open Settings', onPress: Permissions.openSettings },
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
						// debugger
						const profile_picture = response.uri;
						const photo = response;
						this.setState({ profile_picture, photo })
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
						// debugger
						const profile_picture = response.uri;
						const photo = response;
						this.setState({ profile_picture, photo })
					}
				});
			}
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

	// 	shareWHATSAPP = (a) => {
	//     const shareOptions = {
	//      title: 'Share via',
	//      url: Platform.OS == 'android' ? 'https://clubenzz.app.link/cluster/' + this.props.navigation.state.params.errorDetail.id + '/' + this.props.navigation.state.params.chassis : 'clubbenz.app.link://cluster/' + this.props.navigation.state.params.errorDetail.id + '/' + this.props.navigation.state.params.chassis,
	//      social: Share.Social.WHATSAPP
	//    };
	//    Share.shareSingle(shareOptions);
	//  }

	shareWHATSAPP = () => {
		Linking.openURL(`whatsapp://send?text=${this.state.errorShareURL}`);
	}

	openShareDialog = () => {

    const shareLinkContent = {
      contentType: 'link',
      contentUrl: this.state.errorShareURL,
      contentDescription: 'Wow, check out this cluster error and its solution!',
    };

    ShareDialog.canShow(shareLinkContent).then(
      function (canShow) {
        return ShareDialog.show(shareLinkContent);
      }
    ).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Share cancelled');
        } else {
          console.log('Share success with postId: '
            + result.postId);
        }
      },
      function (error) {
        console.log('Share fail with error: ' + error);
      }
    );
  }

	sendSMS = () => {
		// debugger
		SendSMS.send({
			body: this.state.errorShareURL,
			recipients: [''],
			successTypes: ['sent', 'queued'],
			allowAndroidSendWithoutReadPermission: false
		}, (completed, cancelled, error) => {
			this.setState({ shareModalVisible: false })
			console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);

		});
	}

	sendSolution = () => {
		AsyncStorage.getItem("user").then(value => {
			if (value != null) {
				var description = this.state.solution;
				var token = JSON.parse(value).token;
				var language = this.props.language.isArabic == true ? 'arabic' : 'english'
				var picture;
				if (this.state.photo.uri != null) {
					// debugger
					picture = {
						name: this.state.photo.fileName ? this.state.photo.fileName : 'photo_' + Date.now() + '.JPG',
						type: this.state.photo.type,
						uri: this.state.photo.uri,
					}
				}
				else {
					// debugger
					picture = '';
				}

				const data = {
					language: language,
					description: description,
					picture: picture,
					token: token,
					cluster_error_id: this.props.navigation.state.params.errorDetail.id,
				}
				// alert(data.cluster_error_id)
				if (description.length == 0) {
					setTimeout(() => {
						Toast.show("Please fill the description", Toast.LONG)
					}, 100)
				} else {
					this.setState({ spinner: true, addSolModalVisible: false })
					authAction.sendSolution(data).then(res => {
						if (res.success) {
							// debugger
							// alert('Solution Submitted Successfully')
							this.setState({ addSolModalVisible: false, spinner: false })
							NavigationService.navigate('ThanksScreen', { user: this.props.user, isSolution: true, });
						} else {
							setTimeout(() => {
								this.setState({ spinner: false, addSolModalVisible: true })
								Toast.show(res.message, Toast.LONG)
							}, 100)
						}
					}).catch(err => {
						this.setState({ spinner: false })
						alert(JSON.stringify(err))
					})
				}

			}
		});
	}

	componentDidMount() {
		this.get_Cluster_error_solution();
		var pictures = [];
		pictures.push(this.props.navigation.state.params.errorDetail.pic1);
		pictures.push(this.props.navigation.state.params.errorDetail.pic2);
		pictures.push(this.props.navigation.state.params.errorDetail.pic3);
		pictures.push(this.props.navigation.state.params.errorDetail.pic4);
		pictures = pictures.filter(Boolean);
		if (pictures.length === 1) {
			var source = [{
				title: '',
				caption: '',
				url: IMG_PREFIX_URL + pictures[0],
			}]
			this.setState({ pictures: source })
		}
		else if (pictures.length === 2) {
			var source = [{
				title: '',
				caption: '',
				url: IMG_PREFIX_URL + pictures[0],
			},
			{
				title: '',
				caption: '',
				url: IMG_PREFIX_URL + pictures[1],
			}]
			this.setState({ pictures: source })
		}
		else if (pictures.length === 3) {
			var source = [{
				title: '',
				caption: '',
				url: IMG_PREFIX_URL + pictures[0],
			},
			{
				title: '',
				caption: '',
				url: IMG_PREFIX_URL + pictures[1],
			},
			{
				title: '',
				caption: '',
				url: IMG_PREFIX_URL + pictures[2],
			}]
			this.setState({ pictures: source })
		}
		else if (pictures.length === 4) {
			var source = [{
				title: '',
				caption: '',
				url: IMG_PREFIX_URL + pictures[0],
			},
			{
				title: '',
				caption: '',
				url: IMG_PREFIX_URL + pictures[1],
			},
			{
				title: '',
				caption: '',
				url: IMG_PREFIX_URL + pictures[2],
			},
			{
				title: '',
				caption: '',
				url: IMG_PREFIX_URL + pictures[3],
			}]
			this.setState({ pictures: source })
		}
	}

	get_Cluster_error_solution = () => {

		carAction.get_Cluster_error_solution({ cluster_error_id: this.props.navigation.state.params.errorDetail.id, token: this.props.navigation.state.params.token })
			.then(res => {
				if (res.success) {
					// debugger
					// alert(JSON.stringify(res.data))
					this.setState({ errorSolutionList: [] });
					this.setState({ errorSolutionList: res.data, error_details: res.error_details });
				}
			})
	}

	like = (solution_id, type) => {
		carAction.error_solution_like({ token: this.props.navigation.state.params.token, type: type, solution_id: solution_id })
			.then(res => {
				if (res.success) {
					//	alert("Feedback Submitted Successfully")
					this.get_Cluster_error_solution();
				} else {
					//	alert("You aleady submitted your Feedback")
				}
			})
	};

	zoomImage = (image) => {
		// alert(image);
		this.setState({ modalVisible: true, zoomImage: image });

	}

	renderItem = ({ item, index }) => {
		return (
			<ClusterErrorSolutionItem
				errorSolution={item}
				key={item.id}
				data={item}
				rowIndex={index}
				refresh={this.get_Cluster_error_solution}
				like={this.like}
				zoomImage={this.zoomImage}
			/>
		);
	};

	findProvider = () => {

		if (this.state.error_details.shop_type != null && this.state.error_details.shop_type != '' && this.state.error_details.shop_type != 'undefinded') {
			// debugger
			if (this.state.error_details.shop_type == "partshop") {
				AsyncStorage.setItem("partShopId", this.state.error_details.shop_id);
				this.props.navigation.navigate("PartShopDetailScreen", { preferences: this.props.navigation.state.params.preferences });
			} else if (this.state.error_details.shop_type == "serviceshop") {
				AsyncStorage.setItem("serviceShopId", this.state.error_details.shop_id);
				this.props.navigation.navigate("ServicesDetailScreen", { preferences: this.props.navigation.state.params.preferences });
			}
			else {
				AsyncStorage.setItem("workshopId", this.state.error_details.shop_id);
				this.props.navigation.navigate("WorkshopDetailScreen", { preferences: this.props.navigation.state.params.preferences });
			}
		} else {
			Toast.show('No Provider suggested for such error type yet....', Toast.SHORT);
		}

	};

	addSolution = () => {
		this.setState({ addSolModalVisible: true })
	}

	onSharePress = () => {
		this.share();
	}

	share = () => {
		this.setState({ shareModalVisible: !this.state.shareModalVisible });
		this.createURL();
	};

	changePosition = (position) => {
		// debugger
		this.setState({ position: position })
	}

	createURL = () => {
		const link =
			new firebase.links.DynamicLink('https://clubenz.com/cluster/' + this.props.navigation.state.params.errorDetail.id + '/' + this.props.navigation.state.params.chassis, 'https://clubenzz.page.link')
				.android.setPackageName('com.clubbenz')
				.ios.setBundleId('org.reactjs.native.example.ClubBenz')
				.ios.setFallbackUrl('https://apps.apple.com/us/app/id1507160684')
				.android.setFallbackUrl('https://play.google.com/store/apps/details?id=com.clubbenz');
		debugger
		firebase.links().createShortDynamicLink(link, "SHORT").then((url) => {
			this.setState({ errorShareURL: url })
		}).catch((err) => {
			console.log(err)
		})
	}

	copyLink = () => {
		Clipboard.setString(this.state.errorShareURL);
		this.setState({ shareModalVisible: !this.state.shareModalVisible })
	}

	render() {
		const profile_picture = this.state.profile_picture
		return (

			<View style={styleClusterErrorScreen.container}>
				<Spinner
					visible={this.state.spinner}
				/>
				<View style={{ position: 'absolute', zIndex: 1 }}>
					<View style={{ zIndex: 1 }}>
						<StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content' />
						<NavigationComponent
							navigation={this.props.navigation}
							// title={this.props.navigation.state.params.title}
							title={this.props.navigation.state.params.fromShare ? this.props.selected_car.model.name + ' ' + this.props.selected_car.year.name : this.props.navigation.state.params.title}
							subTitle={__('How can we help', this.props.language)}
							goBack={() => this.props.navigation.goBack()}
							// rightIcon={true}
							// share={true}
							// onSharePress={this.onSharePress}
						/>
					</View>
				</View>

				<View
					style={{
						zIndex: -1,
						marginTop: height * 0.085,
						// aspectRatio: 1.7777,
						width: metrics.deviceWidth,
						marginBottom: -20,
						height: height / 2.5
					}}
				>

					<Slideshow
						arrowLeft={<Image source={require('../resources/icons/left_arrow.png')} />}
						arrowRight={<Image source={require('../resources/icons/right_arrow.png')} />}
						dataSource={this.state.pictures}
						position={this.state.position}
						indicatorSize={this.state.indicatorSize}
						onPositionChanged={position => this.changePosition(position)}
						marginBottom={30}
						indicatorColor='rgba(255,255,255, 0.1)'
						height={height / 2.5}
						scrollEnabled={true} />

				</View>

				{/* <View
					style={{
						zIndex: -1,
						marginTop: height * 0.1,
					}}
				>
					<ImageBackground
						style={{
							aspectRatio: 1.7777,
						}}
						// source={require('../resources/images/car_error_sample-2.png')}
						source={{ uri: IMG_PREFIX_URL + this.props.navigation.state.params.errorDetail.pic1 }}

					/>
				</View> */}


				<View style={[styleClusterErrorScreen.solutionsContainer]}>
					<ScrollView showsVerticalScrollIndicator={false}>

						<Text style={[styleClusterErrorScreen.problemHeading]}>
							{this.props.navigation.state.params.errorDetail ? this.props.navigation.state.params.errorDetail.title : "Dummy Tittle Stop vechile Shifts to p Leave "}
						</Text>

						<Text numberOfLines={7} style={styleClusterErrorScreen.problemStatement}>
							{/* What i am trying to suggest solution to you guyz. I am just testing the solution for the development purposes. Making sure that the text fields are been precised accurately. Just make sure this works fine. This is a sample text to determine the length of the view should be working fine, nothing else */}
							{this.props.navigation.state.params.errorDetail ? (this.props.language.isArabic == true ? this.props.navigation.state.params.errorDetail.description_arabic : this.props.navigation.state.params.errorDetail.description) : "Dummy Description Stop vechile Shifts to p Leave "}
						</Text>

						<SplitHeading
							text={__('What might cause such error', this.props.language)}
							headingStyle={{ padding: 5, marginVertical: 12, }}
							lineColor={{ backgroundColor: 'rgba(6,0,41, 0.2)' }}
							textColor={{ color: colors.grey93, fontFamily: Fonts.circular_medium, fontSize: 14, }}
						/>
						<View style={styles.center}>
							<FlatList
								data={this.state.errorSolutionList}
								renderItem={this.renderItem}
								keyExtractor={(item, index) => index.toString()}
								showsVerticalScrollIndicator={false}
								extraData={this.state}
							/>
						</View>

						<TouchableOpacity onPress={() => this.addSolution()}>
							<View style={styleClusterErrorScreen.submitSolution}>
								<Text style={styleClusterErrorScreen.submitSolutionText}>{__('Add your solution to help others', this.props.language)}</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.findProvider}>
							<View style={styleClusterErrorScreen.btnStyle}>
								<Text style={styles.tapButtonStyleTextBlue}>{__('Find a service provider', this.props.language)}</Text>
							</View>
						</TouchableOpacity>

					</ScrollView>
				</View>


				<Modal animationType="fade" transparent={true} visible={this.state.addSolModalVisible} onRequestClose={() => { this.setState({ addSolModalVisible: false }); }}>
					<ScrollView>
						<View style={{ width: width, height: height, zIndex: -3, justifyContent: 'center', alignItems: 'center', }} >
							<View style={{ width: width / 1.1, height: 200, backgroundColor: '#EFEFF4', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10, }}>
								<View style={[{ borderWidth: 1, borderColor: 'grey', position: 'absolute', top: -15, right: -8, width: 33, height: 33, borderRadius: 16, }, styles.center]} >
									<TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => this.setState({ addSolModalVisible: false })} >
										<Image style={{ width: 33, height: 33 }} source={require('../resources/images/cross_image.png')} />
									</TouchableOpacity>
								</View>
								<TextInput style={[styles.inputField, { borderColor: '#E5E5EA', height: 100,marginTop: 10, flex: 0.9, textAlign: this.props.language.isArabic ? 'right' : 'left' }]} multiline={true} numberOfLines={5} placeholder={__('Enter Solution...', this.props.language)} placeholderTextColor='rgba(0, 0, 0, 0.5)' value={this.state.solution} textInputStyle={{ fontFamily: Fonts.CircularMedium, color: '#000000' }} onChangeText={solution => this.setState({ solution: solution })} />
								<TouchableOpacity onPress={() => this.showImagePicker()} style={styleClusterErrorScreen.staticImages}>
									<View style={{ height: 60, width: 60, borderRadius: 50, overflow: 'hidden', justifyContent: 'flex-end' }}>
										<Image
											resizeMode='cover'
											style={{ width: 60, height: 60, padding: 10, }}
											source={profile_picture == '' ? require("../resources/icons/add-image.png") : { uri: profile_picture }}
										/>
									</View>

								</TouchableOpacity>



							</View>

							<View style={{ height: 50, width: width / 1.1, backgroundColor: '#EFEFF4', flexDirection: 'row', justifyContent: 'center', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, }}>
								<TouchableOpacity onPress={this.sendSolution} style={[styles.tapableButtonHollow, { width: width / 3, height: 40 }]}>

									<Text style={styles.tapButtonStyleTextBlue}>{__('Submit', this.props.language)}</Text>

								</TouchableOpacity>
							</View>



						</View>
					</ScrollView>
				</Modal>


				<Modal
					animationType="fade"
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						this.setState({ modalVisible: false });
					}}
				>
					<View
						style={{
							width: width,
							height: height,

							paddingTop: height / 10,
							paddingLeft: width / 9,
							paddingRight: width / 9,
							paddingBottom: height / 11,
						}}
					>

						<View
							style={{
								borderWidth: 2,
								flex: 1,
								borderColor: 'grey',
								backgroundColor: '#FFFFFF',
							}}
						>

							{/* <Image
									source={{uri:this.props.imageUrl}}
									style={{ flex: 1, resizeMode: 'contain' }}
							/> */}
							<ImageViewer backgroundColor={"white"} imageUrls={[{ url: this.state.zoomImage, props: {} }]} />
							<View
								style={{
									borderWidth: 1,
									borderColor: 'grey',
									position: 'absolute',
									top: -15,
									right: -8,
									// backgroundColor: 'white',
									width: 33,
									height: 33,
									borderRadius: 16,
								}}
							>
								<TouchableOpacity
									style={{
										flex: 1,
										justifyContent: 'center',
										alignItems: 'center'
									}}
									onPress={() => this.setState({ modalVisible: false })}
								>
									<Image style={{ width: 33, height: 33 }} source={require('../resources/images/cross_image.png')} />
									{/* <Text >X</Text> */}
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

				<Modal
					transparent={true}
					visible={this.state.shareModalVisible}
					animationType="slide"
					onRequestClose={() => {
						this.share();
					}}
					style={{ alignItems: 'flex-end' }}
				>

					<View style={{ flex: 1, backgroundColor: '#08080847' }} >
						<View style={{ flex: 0.3, }}></View>
						<View style={styleClusterErrorScreen.shareModelStyle}>
							<View style={styleClusterErrorScreen.modalInnerView}>
								<View style={[styles.center, { backgroundColor: '#FFFFFF', borderRadius: metrics.radius15, }]}>
									<Text style={{ height: 30, fontSize: 13, alignItems: "center", justifyContent: 'center', fontFamily: Fonts.CircularBold, color: '#5A5A5A', marginTop: 10, borderBottomColor: '#000000', width: metrics.deviceWidth - 10, textAlign: 'center' }}>{__('Share Via', this.props.language)}</Text>

									<TouchableOpacity style={styles.center} onPress={() => this.openShareDialog()}>
										<View style={styleClusterErrorScreen.shareBtnStyle}>
											<Text style={styleClusterErrorScreen.shareBtnText} >{__('Facebook', this.props.language)}</Text>
										</View>
									</TouchableOpacity>

									<TouchableOpacity style={styles.center} onPress={() => this.shareWHATSAPP()}>
										<View style={styleClusterErrorScreen.shareBtnStyle}>
											<Text style={styleClusterErrorScreen.shareBtnText} >{__('WhatsApp', this.props.language)}</Text>
										</View>
									</TouchableOpacity>

									<TouchableOpacity style={styles.center} onPress={() => this.sendSMS()}>
										<View style={styleClusterErrorScreen.shareBtnStyle}>
											<Text style={styleClusterErrorScreen.shareBtnText} >{__('SMS', this.props.language)}</Text>
										</View>
									</TouchableOpacity>

									<TouchableOpacity style={styles.center} onPress={() => this.copyLink()}>
										<View style={styleClusterErrorScreen.shareBtnStyle}>
											<Text style={styleClusterErrorScreen.shareBtnText} >{__('Copy Link', this.props.language)}</Text>
										</View>
									</TouchableOpacity>

								</View>

							</View>
						</View>
					</View>
					<TouchableOpacity style={styles.center} onPress={this.share}>
						<View style={[styleClusterErrorScreen.shareCancelBtnStyle, { backgroundColor: '#E6EFF9' }]}>
							<Text style={styleClusterErrorScreen.shareCancelBtnText}>{__('Cancel', this.props.language)}</Text>
						</View>
					</TouchableOpacity>

				</Modal>

			</View>
		);
	}
}

mapStateToProps = (state) => {
	return {
		language: state.language,
		user: state.auth.user,
		selected_car: state.auth.selected_car,
		isIndicator: state.init.is_loading_indicator,
	}
}

export default connect(mapStateToProps, null)(ClusterErrorSolutionsScreen);

const styleClusterErrorScreen = StyleSheet.create({
	container: {
		backgroundColor: 'black',
		zIndex: -1,
		flex: 1,
	},
	preview: {
		width: 70,
		height: 70,
		borderRadius: 70,
		overflow: 'hidden'
	},
	submitSolutionText: {
		color: colors.grey93,
		textAlign: 'center',
		fontFamily: Fonts.CircularMedium,
		fontSize: fonts.size.h13,
	},
	listItemText: {
		color: '#344651',
		fontSize: 14,
	},
	btnStyle: {
		width: metrics.deviceWidth - 40,
		height: 60,
		justifyContent: 'center',
		alignSelf: 'center',
		backgroundColor: 'transparent',
		borderColor: colors.blueText,
		borderWidth: 1,
		borderStyle: 'solid',
		borderRadius: metrics.radius40,
		marginVertical: 4,
	},
	shareBtnText: {
		fontSize: 18,
		color: '#11455F',
		fontFamily: Fonts.CircularBold,
	},
	submitSolution: {
		paddingVertical: 20,
		borderColor: colors.grey93,
		borderWidth: 1,
		borderStyle: 'dashed',
		borderRadius: 8,
		marginVertical: 12,

	},
	problemHeading: {
		marginTop: 12,
		color: colors.blueText,
		fontSize: 25,
		textAlign: 'center',
		fontFamily: Fonts.circular_book,
	},
	problemStatement: {
		marginTop: 12,
		paddingHorizontal: metrics.doubleBaseMargin,
		color: '#060029',
		fontSize: 14,
		textAlign: 'center',
		fontFamily: Fonts.circular_book,
	},
	solutionsContainer: {
		flex: 1,
		backgroundColor: 'white',
		zIndex: -1,
		marginTop: 0,
		borderTopStartRadius: metrics.radius20,
		borderTopEndRadius: metrics.radius20,
		padding: metrics.smallPadding,
		// alignItems: 'center',
		// justifyContent: 'center',
	},
	staticImages: {
		borderRadius: 60,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},

	modalInnerView: {
		borderRadius: metrics.radius15,
	},

	shareModelStyle: {
		flex: 0.7,
		justifyContent: 'flex-end',
		marginRight: metrics.deviceWidth - (metrics.deviceWidth - 5),
		marginLeft: metrics.deviceWidth - (metrics.deviceWidth - 5),
		borderRadius: metrics.radius15,
	},
	shareBtnStyle: {
		width: metrics.deviceWidth - 10,
		height: 60,
		borderWidth: 0.7,
		borderTopWidth: 0.5,
		borderBottomWidth: 0,
		borderRightWidth: 0,
		borderLeftWidth: 0,
		borderStyle: 'solid',
		alignItems: "center",
		justifyContent: 'center',
		// borderColor: '#3F3F3F',
	},

	shareCancelBtnStyle: {
		width: metrics.deviceWidth - 10,
		height: 60,
		marginTop: 15,
		marginBottom: 20,
		backgroundColor: '#E6EFF9',
		borderRadius: metrics.radius40,
		alignItems: "center",
		justifyContent: 'center',
	},
	shareCancelBtnText: {
		color: '#0E2D3C',
		fontSize: 18,
		fontFamily: Fonts.CircularBold,
		textAlign: 'center',
	},

});

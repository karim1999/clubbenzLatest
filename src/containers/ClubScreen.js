import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	StatusBar,
	Text,
	FlatList,
	TouchableOpacity,
	Dimensions,
	Image,
	ImageBackground,
	TouchableWithoutFeedback,
	Platform,
	Linking,
	I18nManager,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles, fonts, colors, metrics } from '../themes';
import { Width } from '../config/dimensions';
import { Fonts } from '../resources/constants/Fonts';
import { connect } from 'react-redux';
import __ from '../resources/copy';
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const data = [
	{
		id: '1',
		name: 'facebook',
		link: 'https://www.facebook.com/Clubenz/',
		color:"#003F8D"
	},
	// {
	// 	id: '2',
	// 	name: 'twitter',
	// 	link: '#',
	// 	color:"#00A1ED"
	// },
	{
		id: '3',
		name: 'Instagram',
		link: '#',
		color:"#FFFFFF"
	},
	// {
	// 	id: '4',
	// 	name: 'Youtube',
	// 	link: 'https://www.youtube.com/channel/UCuEcmI6SK4J1EinwoO07_1g/www.Clubenz.com',
	// 	color:"#CD0C24"
	// },
	{
		id: '5',
		name: 'Clubenz',
		link: 'https://www.clubenz.com',
		color:"#0E2D3C"
	},

	{
		id: '6',
		name: 'Support@clubenz.com',
		link: 'mailto:support@clubenz.com?subject=Clubenz&body=Hi Team',
		color:"#E6EFF9"
	},
];
class ClubScreen extends Component {
	constructor(props) {
		super(props);
		this.getSocialImage = this.getSocialImage.bind(this);
	}

	renderItem = item => {
		return (
			<View
				style={{
					height: height * 0.08,
					width: width * 0.8,
					backgroundColor: '#fff',
					borderRadius: width * 0.02,
					marginTop: height * 0.3,
				}}
			>
				<Text>{item.name}</Text>
			</View>
		);
	};

	getSocialImage(imgId) {
		if (imgId == '1') {
			return (
				<Image
					source={require('../resources/icons/fb_icon.png')}
					style={{ height: height * 0.07, width: height * 0.07 }}
				/>
			);
		} else if (imgId == '2') {
			return (
				<Image
					source={require('../resources/icons/insta_icon.png')}
					style={{ height: height * 0.07, width: height * 0.07 }}
				/>
			);
		} else if (imgId == '3') {
			return (
				<Image
					source={require('../resources/icons/youtube_icon.png')}
					style={{ height: height * 0.07, width: height * 0.07 }}
				/>
			);
		} else {
			return (
				<Image
					source={require('../resources/icons/link_icon.png')}
					style={{ height: height * 0.07, width: height * 0.07 }}
				/>
			);
		}
	}

	openLink (link) {
		Linking.openURL(link)
	}
	render() {
		return (
			<View style={[styleSplashScreen.container]}>
			<View style={styleSplashScreen.containerTop}>
			<StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
				<ImageBackground
					source={require('../resources/images/bg_top.png')}
					style={styleSplashScreen.imageBackground}
				>
				<View style={{ backgroundColor:'transparent'}}>
								<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
									<View style={{  marginLeft: 20,marginTop: Platform.OS == 'android' ? 10 : 25, height: 32,width: 32 }}>
										<Image
											source={require('../resources/images/ic-back.png')}
											style={{ flex: 1, height: 32, width: 32, resizeMode: 'contain', transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]  }}
										/>
									</View>
								</TouchableOpacity>
			</View>
			<View style={[{justifyContent:"center",alignItems:'center'}]}>
			<Image
						style={{

							marginTop: 50,
						}}
						source={require('../resources/images/logo_big.png')}
					/>
			</View>

				</ImageBackground>
			</View>
			<View style={styleSplashScreen.bottomContainer}>
			<View style={{marginBottom: 20}}>

				<Text
					style={{
						textAlign: 'center',
						// paddingHorizontal: width * 0.01,
						marginTop: width * 0.025,
						// fontSize: width * 0.043,
						fontSize: 16,
						color: '#000000',
						fontFamily: Fonts.circular_book,
						paddingHorizontal: Width(2.9),
					}}
					>
					{__('enabling your location and notifications shall give you access to nearst providers and latest promotions.' , this.props.language)}
				</Text>
			</View>


						 <FlatList
						 			style={{marginTop: 10}}
									showsVerticalScrollIndicator={false}
									data={data}
									keyExtractor={(item, index) => item.id}
									renderItem={({ item, index }) => (
										<TouchableOpacity key={item.name} onPress={()=>this.openLink(item.link)}>
											<View style={[styles.tapableButton, styleSplashScreen.btnStyle, styles.center , {backgroundColor:item.color} , item.name == 'Instagram' ? {borderWidth: 0.5,borderColor: '#0E2D3C', borderWidth: 1, }:{}]}>
												{/* <Text style={[styles.tapButtonStyleTextWhite,item.name == 'Instagram' || item.name == 'Support@clubenz.com' ? {color: '#000000',}:{}]}>{item.name}</Text> */}


												{/* {item.name == 'Support@clubenz.com' ? <Text style={[styles.tapButtonStyleTextWhite, item.name == 'Support@clubenz.com' ? {color: '#000000'} : null]}>{item.name}</Text> : <Image style={{resizeMode: 'contain', width: 150, height: 50}} source={item.name == 'Instagram' ? require('../resources/images/INSTAGRAM.jpeg') : (item.name == 'twitter' ? require('../resources/images/TWITTER.jpeg') : (item.name == 'Youtube' ? require('../resources/images/YOUTUBE.jpeg') : (item.name == 'Clubenz' ? require('../resources/images/CLUBBENZ.jpeg') : (item.name == 'facebook' ? require('../resources/images/FACEBOOK.jpeg') : null))))}/>} */}

												{item.name == 'Support@clubenz.com' ? <Text style={[styles.tapButtonStyleTextWhite, item.name == 'Support@clubenz.com' ? {color: '#000000'} : null]}>{item.name}</Text> : <Image style={{resizeMode: 'contain', width: 100, height: 40}} source={item.name == 'Instagram' ? require('../resources/images/insta.png') : (item.name == 'twitter' ? require('../resources/images/twit.png') : (item.name == 'Youtube' ? require('../resources/images/you.png') : (item.name == 'Clubenz' ? require('../resources/images/club.png') : (item.name == 'facebook' ? require('../resources/images/face.png') : null))))}/>}

											</View>
										</TouchableOpacity>
									)}
									ListFooterComponent={this._renderFooter}
								/>

						{/* <ScrollView style={{marginTop: 10}}>
							<Image style={{aspectRatio: 7, width: width - 40, resizeMode: 'contain'}} source={require('../resources/images/fb.png')}/>
						</ScrollView> */}




			</View>
		</View>
		);
	}
}

mapStateToProps = (state) => {
	return {
		language: state.language,
	}
}

export default connect(mapStateToProps, null)(ClubScreen);

const styleSplashScreen = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
	containerTop: {
		height: height / 2.5,
	},
	containerBottom: {
		marginTop: -30,
		backgroundColor: 'white',
		borderTopEndRadius: metrics.radius15,
		borderTopStartRadius: metrics.radius15,
		padding: 40,
	},
	containerBottomInner: {
		height: 155,
	},
	btnStyle: {
		width: metrics.deviceWidth - 40,
		marginBottom: 10,
	},
	imageBackground: {

		width: '100%',
		height: '100%',
		flex: 1,
	},
	imagelogo:{
		...styles.center,
	},
	languageSectionMain: {
		color: colors.blueText,
		fontSize: fonts.size.h1,
		padding : 5
	},
	languageSectionHelper: {
		color: colors.grey93,
		padding : 15
	},
	sectionBreak: {
		textAlign: 'center',
		color: colors.grey93,
		padding : 10
	},
	bottomContainer: {
		height: metrics.deviceHeight / 2 - 40,
		width: metrics.deviceWidth,
		marginTop: -20,
		backgroundColor: colors.white,
		borderTopEndRadius: metrics.radius15,
		borderTopStartRadius: metrics.radius15,
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 20,

	  },
});

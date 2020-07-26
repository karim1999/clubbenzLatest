import React from 'react';
import { Text, View, Dimensions, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from "react-native-vector-icons/AntDesign"

import { colors } from '../../themes';
const { width, height } = Dimensions.get('window');
import { IMG_PREFIX_URL } from '../../config/constant';
import { Fonts } from '../../resources/constants/Fonts';
import __ from '../../resources/copy';
import ListingAd from '../../components/common/listingAd';
import TimeAgo from 'javascript-time-ago'

// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en'
import ar from 'javascript-time-ago/locale/ar'

renderAds = (preferences) => {
	// for (i = 0; i < preferences.home_ads.length; i++) {
	// 	if(preferences.home_ads[i].type === "Listing"){
	// 	  return   <ListingAd home_ads={preferences.home_ads[i]} /> ;
	// 	}
	// }

	if (preferences.banner[1] != null && preferences.banner[1].status === 'active' && preferences.banner[1].type == 'Provider Listing') {
		// debugger
		return <ListingAd home_ads={preferences.banner[1]} marginTop={12} marginHorizontal={20} />;
	  } else {
		return null;
	  }

}

const ListItem = ({ item, index, onPress, language, length, preferences, favorite }) => {
	const arr_temp = "";
	console.log(item);
	// alert(JSON.stringify(item))
	// debugger;
	TimeAgo.addLocale(ar)
	TimeAgo.addLocale(en)
	let timeAgo;
	if(language.isArabic){
		timeAgo = new TimeAgo('ar')
	}else{
		timeAgo = new TimeAgo('en-US')
	}
	if(item.add_date){
		var myDate = item.add_date;
		myDate = myDate.split("-");
		var newDate = myDate[1]+"/"+myDate[2]+"/"+myDate[0];
	}
	let finalPrice= item.price;
	if(item.discount && item.discount > 0){
		let finalPricePercent= 100 - item.discount;
		finalPrice= finalPrice * finalPricePercent/100
	}

	return (
		<View>
			<TouchableOpacity style={[styles.container]} onPress={() => onPress(item)}>
				<View style={styles.leftContainer}>
					<View style={styles.backView}>
						<Image
							style={styles.backImage}
							// source={{uri:IMG_PREFIX_URL+item.image}}
							source={{uri:IMG_PREFIX_URL+item.main_image}}
						/>
						{
							favorite &&
							<Icon2
								style={{position: 'absolute'}}
								name={"star"} size={15} color={"#0e2d3c"}/>
						}
					</View>
					{/* <View style={{ position: 'absolute', bottom: height * 0.08, left: width * 0.03 }}>
						<View
							style={{
								backgroundColor: '#2eac6d',
								flexDirection: 'row',
								alignItems: 'center',
								borderRadius: width * 0.05,
								paddingHorizontal: width * 0.02,
								paddingVertical: width * 0.01,
							}}
						>
							<Text style={{ color: '#fff', fontSize: width * 0.02, fontFamily: Fonts.CircularBlack }}>{item.part_case}</Text>
						</View>
					</View> */}
				</View>
				<View style={styles.midContainer}>
					<View style={styles.textWrapper}>
						<View style={{ flex: 1, flexDirection: 'column' }}>
							<View style={{flex: 0.5, backgroundColor: '#FFFFFF', justifyContent: 'center'}}>
								<View style={{flexDirection: 'row'}}>
									<View style={{ borderColor: '#2eac6d', borderRadius: 4, borderWidth: 1, alignItems: 'center', height: 14, marginTop: 5, marginBottom: 5, paddingHorizontal: 5}}>
										<Text style={{ color: '#2eac6d', fontSize: width * 0.02, fontFamily: Fonts.circular_black }}>{__(item.part_case, language)}</Text>
									</View>
									{
										item.featured &&
										<View style={{ borderColor: '#2eac6d', borderRadius: 4, borderWidth: 1, alignItems: 'center', height: 14, marginTop: 5, marginBottom: 5, marginHorizontal: 5, paddingHorizontal: 5}}>
											<Text style={{ color: '#2eac6d', fontSize: width * 0.02, fontFamily: Fonts.circular_black }}>{__("Featured", language)}</Text>
										</View>
									}
								</View>
							</View>
							<View style={{flex: .5}}>
								<Text style={[styles.name, {paddingLeft: 0, maxWidth: 170, alignSelf: 'flex-start'}]}>{language.isArabic == true ? item.title + arr_temp : item.title}</Text>
							</View>
						</View>

						<View style={{ alignItems: 'flex-end', flex: 1 }}>
							<Text style={{ color: colors.blueText, fontSize: width * 0.04, fontFamily: Fonts.CircularBook }}>{finalPrice ? finalPrice : "0"} {__('EGP', language)}</Text>
							<View style={{ flexDirection: 'row' }}>
							{item.discount && item.discount >0 ?	<View
									style={{
										backgroundColor: colors.badge,
										flexDirection: 'row',
										alignItems: 'center',
										borderRadius: width * 0.05,
										paddingHorizontal: width * 0.02,
										paddingVertical: width * 0.01,
									}}
								>
								<Text style={{ color: '#fff', fontSize: width * 0.015, fontFamily: Fonts.CircularMedium }}>{item.discount ?item.discount: '' }%</Text>
								</View>:null}
								{item.discount && item.discount >0 ?
								<Text
									style={{
										color: colors.gray50,
										textDecorationLine: 'line-through',
										paddingLeft: 5,
										fontSize: width * 0.03,
										fontFamily: Fonts.CircularMedium,
									}}
								>
								{item.price ? item.price : '0'} {__('EGP', language)}
								</Text>
									:null}
							</View>
						</View>
					</View>
					<View style={styles.belowTextWrapper}>
						<Text style={styles.dis}>{item.username ? item.username : item.part_brand ? item.part_brand[0].name:'Seller name'}</Text>
						<Text style={styles.data}>{item.add_date ? timeAgo.format((new Date(newDate)).getTime()) :'7 Jan'} </Text>
					</View>
				</View>
				<View style={styles.rightContainer} />
			</TouchableOpacity>
			{
				(index + 1) % 5 === 0 && (index + 1) != 0 ?
					preferences.banner[1] != null && preferences.banner[1].status === 'active' && preferences.banner[1].type === 'Provider Listing' ? <ListingAd home_ads={preferences.partcatlog[index % preferences.partcatlog.length]} marginTop={12} marginHorizontal={20} /> : null : null
			}
			</View>


	);
};
const styles = StyleSheet.create({
	container1: {},
	container: {
		marginHorizontal: width * 0.02,
		marginTop: height * 0.02,
		borderRadius: width * 0.02,
		backgroundColor: '#fff',
		flexDirection: 'row',
		overflow: 'hidden',
		minHeight: height * 0.11,
	},
	textWrapper: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		paddingHorizontal: width * 0.02,
		alignItems: 'center',
		flex: 2,
	},
	belowTextWrapper: {
		flexDirection: 'row',
		paddingTop: 5,
		paddingBottom: 5,
		flex: 1,
		justifyContent: 'space-between',
		paddingHorizontal: width * 0.02,
	},
	leftContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.lightGray,
	},
	image: {
		height: width * 0.15,
		width: width * 0.15,
		resizeMode: 'contain',
	},
	midContainer: {
		flex: 4,
		justifyContent: 'center',
	},
	backView: {
		position: 'absolute',
	},
	backImage: {
		height: width * 0.17,
		width: width * 0.17,
		resizeMode: 'contain',
	},
	name: {
		color: '#000',
		fontSize: width * 0.03,
		paddingHorizontal: width * 0.02,
		paddingBottom: height * 0.01,
		fontFamily: Fonts.CircularBook,
	},
	dis: {
		color: colors.blueText,
		fontSize: width * 0.025,
		fontFamily: Fonts.CircularMedium,
	},
	data: {
		// color: colors.darkGray,
		color: '#9C9C9D',
		fontSize: width * 0.025,
		fontFamily: Fonts.CircularMedium,
	},
});
export default ListItem;

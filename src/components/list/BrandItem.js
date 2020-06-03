import React from 'react';
import {  Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';

import { colors } from '../../themes';
import { IMG_PREFIX_URL } from '../../config/constant';
import ListingAd from '../../components/common/listingAd';
import {Fonts} from '../../resources/constants/Fonts';

renderAds = () => {
	for (i = 0; i < preferences.home_ads.length; i++) {
		if(preferences.home_ads[i].type === "Listing"){
		  return   <ListingAd home_ads={preferences.home_ads[i]} /> ;
		}
	}
}

const BrandItem = ({ item, onPress, length }) => {
	return (

		<TouchableOpacity onPress={() => onPress(item)}>
		<View style={styles.ItemNotSelect}>
		{item.name == 'All' || item.name == 'كل القطع' ? <View style={[ styles.BrandViewStyle, {justifyContent: 'center', alignItems: 'center', borderColor: item.isActive ? colors.blueButton:'white', backgroundColor: 'white'}]}><Text style={{color: '#11455F', fontFamily: Fonts.circular_black}}>{item.name}</Text></View>
		: <View style={{ borderWidth: 3, borderRadius: 5, borderColor: item.isActive ? colors.blueButton:'white', height: 34, width: 90, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'}}>
			<Image style={[{height: 28, width: 84, overflow: 'hidden', margin: 2, resizeMode: 'contain'}]}
            source={ { uri: IMG_PREFIX_URL + item.image }}/>
		</View>
		}
		{/* <Image
            style={{
              height: 30,
			  width: 90,
			  borderColor: item.isActive ? colors.blueButton:'white',
			  borderWidth: 3,
			  borderRadius:5
             }}
            source={ { uri: IMG_PREFIX_URL + item.image }}
          /> */}
		</View>
		</TouchableOpacity>
	);
};
const styles = StyleSheet.create({
	ItemNotSelect: {
		padding:10,
		marginVertical: 10,
	},
	BrandViewStyle: {
		// height: 30,
		// width: 90,
		height: 34,
		width: 90,

		borderWidth: 3,
		borderRadius:5
	}
});
export default BrandItem;

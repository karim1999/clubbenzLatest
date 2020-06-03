import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { colors, styles } from '../../themes';
import { IMG_PREFIX_URL } from '../../config/constant';
import { Fonts } from '../../resources/constants/Fonts';
const { height, width } = Dimensions.get('window');

const CategoryItem = ({ item, onPress, language }) => {
	return (
		<TouchableOpacity onPress={()=> onPress(item)}>
			<View style={[categoryItemStyle.container]}>
				<View style={[{ flex: 1 }, styles.center]}>
					<Image style={categoryItemStyle.image} source={{uri:IMG_PREFIX_URL+item.main_image}}  />
				</View>
				<View style={[{ flex: 1 }, styles.center]}>
					<Text style={categoryItemStyle.text}>{language.isArabic == true ? item.title_arabic : item.title}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};
const categoryItemStyle = StyleSheet.create({
	container: { flex: 1, height: height * 0.15, width: height * 0.12, marginLeft: width * 0.04, flexDirection: 'column' },
	image: { resizeMode: 'contain', width: height * 0.06, height: height * 0.06 },
	text: {
		textAlign: 'center',
		color: colors.blueText,
		fontSize: width * 0.03,
		fontFamily: Fonts.CircularBlack
	},
});

export default CategoryItem;

import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../themes';
import { IMG_PREFIX_URL } from '../../config/constant';
import { Fonts } from '../../resources/constants/Fonts';
const { height, width } = Dimensions.get('window');

const OtherCategory = ({ name, Item , onPress, language }) => {
	return (
		<View style={otherCategoryStyle.container}>
			<TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
				{/* <View
					style={{
						flex: 1,
						// width: '80%',
						alignSelf: 'center',
					}}
				> */}
					{/* <Image style={otherCategoryStyle.image} source={require('../../resources/images/Image10.png')} /> */}

					<Image style={otherCategoryStyle.image} source={{uri:IMG_PREFIX_URL+Item.image}} />

				{/* </View> */}
				<Text style={otherCategoryStyle.text}>{language.isArabic == true ? Item.arabic_name : Item.name}</Text>
			</TouchableOpacity>
		</View>
	);
};
const otherCategoryStyle = StyleSheet.create({
	container: {
		width: width / 3,
		borderWidth: 1,
		height: height * 0.17,
		paddingVertical: height * 0.01,
		borderColor: colors.disable,
		// backgroundColor: 'blue'
	},
	image: { flex: 1, aspectRatio: 0.8, /*resizeMode: 'contain'*/ height: height * 0.1, width: height * 0.1, maxWidth: height * 0.1, maxHeight: height * 0.1, resizeMode: 'contain', alignSelf: 'center' },
	text: { textAlign: 'center', maxWidth: (width / 3), color: '#0E2D3C', paddingHorizontal: width * 0.05, fontSize: width * 0.035, fontFamily: Fonts.circular_book },
});

export default OtherCategory;

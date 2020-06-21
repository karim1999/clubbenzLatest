import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet, Dimensions, I18nManager } from 'react-native';
import { colors } from '../../themes';
import Icon from 'react-native-vector-icons/AntDesign';
const { height, width } = Dimensions.get('window');
import { IMG_PREFIX_URL } from '../../config/constant';
import { Fonts } from '../../resources/constants/Fonts';
const SubCategory = ({ Item, onPress, language }) => {
	return (
		<TouchableOpacity onPress={onPress} style={[otherCategoryStyle.container, Item.parts <= 0 && {backgroundColor: "#c1c7ca"}]}>
			<View
				style={{
					flex: 1,
					width: '100%',
					alignSelf: 'center',
					flexDirection: 'row',
				}}
			>
				<View style={otherCategoryStyle.leftContainer}>
					<View style={{ flex: 1, margin: 5 }}>
						<Image
							style={otherCategoryStyle.image}
							source={{uri:IMG_PREFIX_URL+Item.image}}
						/>
					</View>
				</View>
				<View style={otherCategoryStyle.midContainer}>
					<Text style={otherCategoryStyle.text}>{language.isArabic == true ? Item.arabic_name : Item.name}</Text>
				</View>
				<View style={otherCategoryStyle.rightContainer}>
					<Icon name={I18nManager.isRTL ? "arrowleft" : "arrowright"} size={width * 0.06} color={colors.blueText} />
				</View>
			</View>
		</TouchableOpacity>
	);
};
const otherCategoryStyle = StyleSheet.create({
	container: {
		borderWidth: 1,
		height: height * 0.1,
		marginTop: height * 0.03,
		borderColor: colors.disable,
		marginHorizontal: width * 0.02,
		borderRadius: width * 0.02,
	},
	leftContainer: {
		flex: 1.5,
	},
	midContainer: {
		flex: 4,
		justifyContent: 'center',
	},
	rightContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: { flex: 1, height: null, width: null, resizeMode: 'contain' },
	text: { color: colors.blueText, fontSize: width * 0.04, paddingLeft: width * 0.02, fontFamily: Fonts.CircularMedium, },
});

export default SubCategory;

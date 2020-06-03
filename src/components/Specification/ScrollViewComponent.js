import React, { Component } from 'react';
import { Text, View, Image, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { colors } from '../../themes';
import { Fonts } from '../../resources/constants/Fonts';
const { width, height } = Dimensions.get('window');
class ScrollViewComponent extends Component {
	render() {
		return (
			<View
				style={{
					backgroundColor: 'white',
					borderRadius: 3,
					marginLeft: 5,
					// height: height * 0.08,
					justifyContent: 'center',
					paddingHorizontal: 10,
					paddingVertical:10
					
				}}
			>
				<Text style={{ fontSize: width * 0.025, fontFamily: Fonts.CircularBold, }}>
					{this.props.title}
				</Text>
				<Text
					numberOfLines={1}
					ellipsizeMode="tail"
					style={{
						// fontWeight: 'bold',
						color: colors.blueText,
						fontSize: width * 0.055,
						paddingHorizontal: 1,
						fontFamily: Fonts.CircularBold,
						// paddingLeft: width * 0.02,
					}}
				>
					{this.props.price}
				</Text>
			</View>
		);
	}
}
export default ScrollViewComponent;

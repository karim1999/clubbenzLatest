import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import { colors, fonts, metrics, styles } from '../../themes';
import NavigationService from '../../NavigationService';

class HowTo extends PureComponent {
	constructor(props) {
		super(props);
		this.getPhoneImage = this.getPhoneImage.bind(this);
		this.getDotsImage = this.getDotsImage.bind(this);
	}
	getPhoneImage() {
		if (this.props.phoneImage == '1') {
			return (
				<Image
					style={howToStyle.howToPhone}
					source={require('../../resources/images/howto_full_service.png')}
				/>
			);
		} else if (this.props.phoneImage == '2') {
			return <Image style={howToStyle.howToPhone} source={require('../../resources/images/howto_shops.png')} />;
		} else if (this.props.phoneImage == '3') {
			return <Image style={howToStyle.howToPhone} source={require('../../resources/images/howto_ratings.png')} />;
		} else {
			return (
				<Image
					style={howToStyle.howToPhone}
					source={require('../../resources/images/howto_cluster_error.png')}
				/>
			);
		}
	}

	getDotsImage() {
		var btnGetStarted = (
			<TouchableOpacity onPress={this.props.getStarted}>
				<View style={[styles.tapableButton, howToStyle.btnStyle]}>
					<Text style={styles.tapButtonStyleTextWhite}>Get Started</Text>
				</View>
			</TouchableOpacity>
		);
		if (this.props.phoneImage == '1') {
			return <Image style={howToStyle.sliderDots} source={require('../../resources/images/howto_dot1.png')} />;
		} else if (this.props.phoneImage == '2') {
			return <Image style={howToStyle.sliderDots} source={require('../../resources/images/howto_dot2.png')} />;
		} else if (this.props.phoneImage == '3') {
			return <Image style={howToStyle.sliderDots} source={require('../../resources/images/howto_dot3.png')} />;
		} else {
			return btnGetStarted;
		}
	}

	render() {
		var imagePath = this.props.phoneImage;
		return (
			<View>
				<View style={howToStyle.container}>
					<Image
						style={{
							height: metrics.deviceHeight / 1.5,
							width: metrics.deviceWidth,
						}}
						source={require('../../resources/images/bg_top.png')}
					/>
					<Image style={howToStyle.logo} source={require('../../resources/images/white-logo.png')} />
					{this.getPhoneImage()}
					<View style={styles.containerBottom}>
						<Text style={[fonts.style.headingTextBoldBlue, howToStyle.headingText]}>
							{this.props.heading}
						</Text>
						<Text style={[fonts.style.descriptionTextBlack, howToStyle.descriptionText]}>
							{this.props.description}
						</Text>
						{this.getDotsImage()}
					</View>
				</View>
			</View>
		);
	}
}

export default HowTo;
HowTo.propTypes = {
	phoneImage: PropTypes.string,
	heading: PropTypes.string,
	description: PropTypes.string,
	scrolDotsImage: PropTypes.string,
	getStarted: PropTypes.func,
};

const howToStyle = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},

	logo: {
		height: 55,
		width: 55,
		position: 'absolute',
		alignSelf: 'center',
		top: 35,
		alignItems: 'center'
	},
	btnStyle: {
		width: metrics.deviceWidth - 15,
		bottom: 20,
	},
	howToPhone: {
		alignSelf: 'center',
		position: 'absolute',
		width: metrics.deviceWidth,
		top: metrics.deviceHeight / 2 - 260 ,
		resizeMode: 'contain',
	},
	sliderDots: {
		alignSelf: 'center',
		resizeMode: 'contain',
		width: 125,
	},
	bottom_view: {
		height: metrics.deviceHeight / 2,
		width: metrics.width,
		position: 'absolute',
		top: metrics.deviceHeight / 2,
		backgroundColor: colors.perpal,
	},
	bottom_view_small: {
		height: metrics.deviceHeight - metrics.deviceHeight / 1.8,
		width: metrics.width,
		position: 'absolute',
		top: metrics.deviceHeight / 2,
		backgroundColor: colors.perpal,
	},
	headingText: {
		margin: 13,
	},
	descriptionText: {
		margin: 5,
	},
});

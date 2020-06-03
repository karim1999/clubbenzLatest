import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Image, StyleSheet, View, Dimensions, Platform, TouchableWithoutFeedback } from 'react-native';
import { colors, fonts, metrics, styles } from '../../themes';
import { Fonts } from '../../resources/constants/Fonts';
const { width, height } = Dimensions.get('window');
class Navigation extends PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>
				<View style={styles.navigationComponent}>
					{this.props.menuIcon ? (
						<TouchableWithoutFeedback onPress={this.props.onMenuPress}>
							<View style={navigationStyle.leftContainer}>
								<Image
									style={styles.navigationMenuButton}
									source={require('../../resources/icons/ic_menu.png')}
								/>
							</View>
						</TouchableWithoutFeedback>
					) : (
						<TouchableWithoutFeedback onPress={this.props.goBack}>
							<View style={navigationStyle.leftContainer}>
								<Image
									resizeMode="contain"
									style={{height:32,width:32, marginLeft: 15,}}
									source={require('../../resources/images/ic-back.png')}
								/>
								
							</View>
						</TouchableWithoutFeedback>
					)}
					{this.props.headerimageIcone ? (
						<Image
							style={{ width: 32, height: 32, marginTop:  (Platform.OS === 'ios') ? height*0.03 : 0, justifyContent: 'center', alignItems: "center"}}
							source={require('../../resources/images/white-logo.png')}
						/>
					) : (
						<View style={navigationStyle.title}>
							<Text
								style={[
									fonts.style.titleTextBoldWhite,
									{ color: colors.white, fontSize: width * 0.05, fontFamily: Fonts.CircularBold, },
								]}
							>
								{this.props.title}
							</Text>
							{this.props.subTitle ? (
								<Text style={navigationStyle.subTitle}>{this.props.subTitle}</Text>
							) : null}
						</View>
					)}

					<View style={navigationStyle.rightContainer}>
						{this.props.rightIcon ? (
							<TouchableWithoutFeedback onPress={this.props.goBack}>
								<View>
									<Image
										style={styles.navigationMenuButton}
										source={require('../../resources/icons/ic_listview.png')}
									/>
								</View>
							</TouchableWithoutFeedback>
						) : (
							<View />
						)}
					</View>
				</View>
			</View>
		);
	}
}
export default Navigation;
Navigation.propTypes = {
	title: PropTypes.string,
	subTitle: PropTypes.string,
};

const navigationStyle = StyleSheet.create({
	title: {
		flex: 2,
		marginTop:Platform.OS==="ios"?height*0.04:0,
		alignItems: 'center',
		justifyContent: 'center',
		fontFamily: Fonts.CircularBold,
	},
	rightContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingRight: 15,
		marginTop:Platform.OS==="ios"?height*0.04:6
	},
	leftContainer: {
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginTop:  (Platform.OS === 'ios') ? 20 : 6,
	},
	subTitle: {
		textAlign: 'center',
		color: colors.white,
		fontSize: fonts.size.tiny,
		fontFamily: Fonts.CircularBook,
	},
});
